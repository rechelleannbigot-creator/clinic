import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { registerClinicRoutes } from "./clinicRoutes.js";
import {
  auth,
  db,
  emailTransporter,
  getSetupIssues,
  credentialFileMissing,
} from "./config.js";

if (credentialFileMissing()) {
  console.warn(
    "Firebase service-account file was not found. Set GOOGLE_APPLICATION_CREDENTIALS to a valid file or configure Google Application Default Credentials.",
  );
}

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json({ limit: "1mb" }));

function makeTemporaryPassword() {
  // 20 random bytes encoded as hex: 40 characters, high entropy.
  return crypto.randomBytes(20).toString("hex");
}

// Builds the Firebase password-setup link and emails it. No password is ever
// generated for email, stored, or logged.
async function sendSetupEmail(transporter, patient, patientId) {
  const loginUrl = process.env.LOGIN_URL || "http://localhost:5173/";
  let link;
  try {
    link = await auth.generatePasswordResetLink(patient.email, { url: loginUrl });
  } catch (error) {
    if (error.code !== "auth/unauthorized-continue-uri") throw error;
    // LOGIN_URL's domain is not in Firebase Auth > Authorized domains yet.
    link = await auth.generatePasswordResetLink(patient.email);
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: patient.email,
    subject: "Set up your Clinic Management System account",
    text:
`Hello ${patient.firstName},

A Clinic Management System account has been created for you.

Patient ID: ${patientId}
Login email: ${patient.email}

Set your password using this secure link:
${link}

After setting your password, sign in here: ${loginUrl}

If you did not expect this email, please contact your school clinic and ignore this message.`,
  });
}

async function recordSetupEmailResult(patientId, sent, errorCode) {
  try {
    await db.collection("patients").doc(patientId).update(
      sent
        ? { setupEmailSent: true, setupEmailSentAt: FieldValue.serverTimestamp(), setupEmailError: FieldValue.delete() }
        : { setupEmailSent: false, setupEmailError: errorCode || "send-failed" },
    );
  } catch (error) {
    console.error("Record setup email status error:", error.message);
  }
}

function emailFailureMessage(error) {
  if (error?.code === "email/not-configured") {
    return "Email is not configured on the server. Add the SMTP settings and restart the backend.";
  }
  if (error?.code === "EAUTH") {
    return "The email server rejected the SMTP username or password.";
  }
  return "The setup email could not be sent. Check the SMTP settings and try again.";
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePatient(data = {}) {
  return {
    firstName: cleanString(data.firstName),
    middleName: cleanString(data.middleName),
    lastName: cleanString(data.lastName),
    age: Number(data.age),
    gender: cleanString(data.gender),
    contact: cleanString(data.contact),
    email: cleanString(data.email).toLowerCase(),
    yearLevel: cleanString(data.yearLevel),
    course: cleanString(data.course),
    section: cleanString(data.section),
  };
}

function validatePatient(patient) {
  if (!patient.firstName || !patient.lastName || !patient.gender ||
      !patient.contact || !patient.email || !patient.yearLevel ||
      !Number.isInteger(patient.age) || patient.age < 1 || patient.age > 120) {
    return "Please provide all required patient fields with a valid age.";
  }

  if (!/^[0-9+\-()\s]+$/.test(patient.contact)) {
    return "Please provide a valid contact number.";
  }

  if (!/^[^\s@]+@gmail\.com$/i.test(patient.email)) {
    return "Please use a valid Gmail address ending in @gmail.com.";
  }

  const highSchool = patient.yearLevel.startsWith("Grade ");
  if (highSchool && !patient.section) {
    return "Please select a section.";
  }
  if (!highSchool && !patient.course) {
    return "Please select a course.";
  }

  return null;
}

app.get("/api/health", (_req, res) => {
  const setupIssues = getSetupIssues();
  return res
    .status(setupIssues.length ? 503 : 200)
    .json({ status: setupIssues.length ? "setup-required" : "ok", setupIssues });
});

async function requireSignedIn(req, res, next) {
  if (credentialFileMissing()) {
    return res.status(503).json({
      message: "Firebase Admin credentials are missing. Add the configured service-account file and restart the backend.",
    });
  }

  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer (.+)$/i);
    if (!match) {
      return res.status(401).json({ message: "Please sign in to access the clinic service." });
    }

    const decoded = await auth.verifyIdToken(match[1]);
    req.authUser = decoded;
    next();
  } catch (error) {
    console.error("Verify user error:", error.message);
    if (error.code?.startsWith("auth/")) {
      return res.status(401).json({ message: "Your session is invalid or expired. Please sign in again." });
    }
    return res.status(503).json({ message: "Unable to verify your session. Please try again." });
  }
}

async function requireClinicStaff(req, res, next) {
  return requireSignedIn(req, res, async () => {
    try {
      const userDoc = await db.collection("users").doc(req.authUser.uid).get();
      const role = String(userDoc.data()?.role || "").toLowerCase().replace(/[\s_-]/g, "");
      if (!userDoc.exists || !["admin", "administrator", "staff", "clinicstaff"].includes(role)) {
        return res.status(403).json({ message: "You are not authorized to access clinic records." });
      }

      req.staffProfile = userDoc.data();
      next();
    } catch (error) {
      console.error("Verify clinic staff error:", error.message);
      return res.status(503).json({ message: "Unable to verify clinic staff access. Please try again." });
    }
  });
}

registerClinicRoutes(app, { db, requireClinicStaff, requireSignedIn });

app.get("/api/patients", requireClinicStaff, async (_req, res) => {
  try {
    const snapshot = await db.collection("patients").get();
    const patients = snapshot.docs
      .map((patientDoc) => ({ ...patientDoc.data(), id: patientDoc.id }))
      .sort((left, right) => left.id.localeCompare(right.id));

    return res.json({ patients });
  } catch (error) {
    console.error("Get patients error:", error.message);
    return res.status(500).json({ message: "Unable to load patient records." });
  }
});

app.post("/api/patients", requireClinicStaff, async (req, res) => {
  let createdUid = null;
  let createdPatientId = null;

  try {
    const patient = normalizePatient(req.body);
    const validationMessage = validatePatient(patient);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    // Firebase Auth enforces email uniqueness. The random password is never
    // saved or emailed; the patient sets their own through a reset link.
    const userRecord = await auth.createUser({
      email: patient.email,
      password: makeTemporaryPassword(),
      displayName: [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" "),
      disabled: false,
      emailVerified: false,
    });
    createdUid = userRecord.uid;

    const counterRef = db.collection("systemCounters").doc("patients");
    const patientRef = await db.runTransaction(async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      let nextNumber = (counterSnap.exists ? Number(counterSnap.data().lastNumber || 0) : 0) + 1;
      const patientId = `P-${String(nextNumber).padStart(3, "0")}`;
      let ref = db.collection("patients").doc(patientId);

      while ((await transaction.get(ref)).exists) {
        nextNumber += 1;
        ref = db.collection("patients").doc(`P-${String(nextNumber).padStart(3, "0")}`);
      }

      transaction.set(counterRef, { lastNumber: nextNumber }, { merge: true });
      transaction.set(ref, {
        ...patient,
        id: patientId,
        uid: userRecord.uid,
        role: "student",
        status: "Active",
        createdAt: FieldValue.serverTimestamp(),
        setupEmailSent: false,
      });
      transaction.set(db.collection("users").doc(userRecord.uid), {
        ...patient,
        uid: userRecord.uid,
        patientId,
        role: "student",
        status: "ACTIVE",
        createdAt: FieldValue.serverTimestamp(),
      });
      return ref;
    });
    createdPatientId = patientRef.id;
    // Records are committed; from here on nothing is rolled back.
    createdUid = null;
    createdPatientId = null;

    const patientId = patientRef.id;
    let emailSent = true;
    let emailWarning = null;
    try {
      await sendSetupEmail(emailTransporter(), patient, patientId);
      await recordSetupEmailResult(patientId, true);
    } catch (mailError) {
      emailSent = false;
      emailWarning = emailFailureMessage(mailError);
      console.error("Setup email error:", mailError.code || mailError.message);
      await recordSetupEmailResult(patientId, false, mailError.code);
    }

    return res.status(201).json({
      message: emailSent
        ? "Patient account created. A password setup link was emailed to the patient."
        : "Patient account created, but the setup email was not sent.",
      warning: emailWarning,
      patient: {
        ...patient,
        id: patientId,
        uid: userRecord.uid,
        role: "student",
        status: "Active",
        setupEmailSent: emailSent,
      },
      emailSent,
    });
  } catch (error) {
    console.error("Create patient error:", error.message);

    // Best-effort cleanup if creation failed after Firebase Auth succeeded.
    if (createdPatientId) {
      await db.collection("patients").doc(createdPatientId).delete().catch(() => {});
    }
    if (createdUid) {
      await db.collection("users").doc(createdUid).delete().catch(() => {});
      await auth.deleteUser(createdUid).catch(() => {});
    }

    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ message: "This Gmail address already has an account." });
    }
    if (error.code === "auth/invalid-password") {
      return res.status(400).json({ message: "Firebase rejected the generated password. Check your Firebase Authentication password policy." });
    }
    return res.status(500).json({
      message: error.message || "Unable to create the patient account. Please try again.",
    });
  }
});

app.post("/api/patients/:patientId/resend-setup-email", requireClinicStaff, async (req, res) => {
  try {
    const patientId = cleanString(req.params.patientId);
    const snapshot = await db.collection("patients").doc(patientId).get();
    if (!snapshot.exists) {
      return res.status(404).json({ message: "Patient record was not found." });
    }

    const patient = snapshot.data();
    try {
      await sendSetupEmail(emailTransporter(), patient, patientId);
    } catch (mailError) {
      console.error("Resend setup email error:", mailError.code || mailError.message);
      await recordSetupEmailResult(patientId, false, mailError.code);
      if (mailError.code === "auth/user-not-found") {
        return res.status(404).json({ message: "No login account exists for this patient email." });
      }
      return res.status(502).json({ message: emailFailureMessage(mailError) });
    }

    await recordSetupEmailResult(patientId, true);
    return res.json({ message: "Password setup email sent.", emailSent: true });
  } catch (error) {
    console.error("Resend setup email error:", error.message);
    return res.status(500).json({ message: "Unable to resend the setup email." });
  }
});

app.put("/api/patients/:patientId", requireClinicStaff, async (req, res) => {
  let patientUid = null;
  let previousAuthUser = null;
  let authUpdated = false;

  try {
    const patientId = cleanString(req.params.patientId);
    if (!/^P-\d{3,}$/.test(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID." });
    }

    const patient = normalizePatient(req.body);
    const validationMessage = validatePatient(patient);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const patientRef = db.collection("patients").doc(patientId);
    const patientSnapshot = await patientRef.get();
    if (!patientSnapshot.exists) {
      return res.status(404).json({ message: "Patient record could not be found." });
    }

    patientUid = cleanString(patientSnapshot.data()?.uid);
    if (!patientUid) {
      return res.status(409).json({ message: "This patient has no linked login account." });
    }

    const userRef = db.collection("users").doc(patientUid);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      return res.status(409).json({ message: "This patient has no linked user profile." });
    }

    previousAuthUser = await auth.getUser(patientUid);
    await auth.updateUser(patientUid, {
      email: patient.email,
      displayName: [patient.firstName, patient.middleName, patient.lastName]
        .filter(Boolean)
        .join(" "),
    });
    authUpdated = true;

    await db.runTransaction(async (transaction) => {
      transaction.update(patientRef, {
        ...patient,
        updatedAt: FieldValue.serverTimestamp(),
      });
      transaction.update(userRef, {
        ...patient,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    const profile = patientSnapshot.data();
    return res.json({
      message: "Patient information updated successfully.",
      patient: {
        ...patient,
        id: patientId,
        uid: patientUid,
        role: profile.role || "student",
        status: profile.status || "Active",
      },
    });
  } catch (error) {
    if (authUpdated && previousAuthUser && patientUid) {
      try {
        await auth.updateUser(patientUid, {
          email: previousAuthUser.email,
          displayName: previousAuthUser.displayName || null,
        });
      } catch (rollbackError) {
        console.error("Restore patient auth profile error:", rollbackError.message);
      }
    }

    console.error("Update patient error:", error.message);
    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ message: "This Gmail address already has an account." });
    }
    if (error.code === "auth/user-not-found") {
      return res.status(409).json({ message: "This patient has no linked login account." });
    }
    return res.status(500).json({ message: "Unable to update the patient record." });
  }
});

app.delete("/api/patients/:patientId", requireClinicStaff, async (req, res) => {
  try {
    const patientId = cleanString(req.params.patientId);
    if (!/^P-\d{3,}$/.test(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID." });
    }

    const patientRef = db.collection("patients").doc(patientId);
    const patientSnapshot = await patientRef.get();
    if (!patientSnapshot.exists) {
      return res.status(404).json({ message: "Patient record could not be found." });
    }

    const patientUid = cleanString(patientSnapshot.data()?.uid);
    if (!patientUid) {
      return res.status(409).json({ message: "This patient has no linked login account." });
    }

    const userRef = db.collection("users").doc(patientUid);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      return res.status(409).json({ message: "This patient has no linked user profile." });
    }

    await db.runTransaction(async (transaction) => {
      transaction.delete(patientRef);
      transaction.delete(userRef);
    });

    await auth.deleteUser(patientUid);

    return res.json({
      message: "Patient account deleted successfully.",
      patientId,
    });
  } catch (error) {
    console.error("Delete patient error:", error.message);
    if (error.code === "auth/user-not-found") {
      return res.status(409).json({ message: "Patient auth account could not be found." });
    }
    return res.status(500).json({ message: "Unable to delete the patient account." });
  }
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Clinic backend listening on http://localhost:${port}`);
});
