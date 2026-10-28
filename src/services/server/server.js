import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const envFile = [".env", "env"]
  .map((file) => path.join(serverDirectory, file))
  .find((file) => existsSync(file));

if (envFile) {
  const { error } = dotenv.config({ path: envFile });
  if (error) {
    throw new Error(`Unable to load backend environment file: ${error.message}`);
  }
}

if (process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    !path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
    serverDirectory,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
  );
}

if (process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    !existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  console.warn(
    "Firebase service-account file was not found. Set GOOGLE_APPLICATION_CREDENTIALS to a valid file or configure Google Application Default Credentials.",
  );
}

function isConfigured(value) {
  return Boolean(value?.trim()) && !/your[-_ ]|placeholder|example/i.test(value);
}

function getSetupIssues() {
  const issues = [];

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      !existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    issues.push("Firebase Admin service-account file is missing");
  }

  const missingEmailSettings = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]
    .filter((key) => !isConfigured(process.env[key]));
  if (missingEmailSettings.length) {
    issues.push(`SMTP settings need configuration (${missingEmailSettings.join(", ")})`);
  }

  return issues;
}

initializeApp({
  credential: applicationDefault(),
  projectId:
    (isConfigured(process.env.FIREBASE_PROJECT_ID)
      ? process.env.FIREBASE_PROJECT_ID
      : process.env.GOOGLE_CLOUD_PROJECT) ||
    "clinic-management-system-c98ba",
  storageBucket:
    (isConfigured(process.env.FIREBASE_STORAGE_BUCKET)
      ? process.env.FIREBASE_STORAGE_BUCKET
      : null) ||
    "clinic-management-system-c98ba.firebasestorage.app",
});

const auth = getAuth();
const db = getFirestore();
const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
}));
app.use(express.json({ limit: "1mb" }));

function makeTemporaryPassword() {
  // 20 random bytes encoded as hex: 40 characters, high entropy.
  return crypto.randomBytes(20).toString("hex");
}

function emailTransporter() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((key) => !isConfigured(process.env[key]));
  if (missing.length) {
    throw new Error(`Email is not configured. Missing: ${missing.join(", ")}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
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

async function requireClinicStaff(req, res, next) {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      !existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return res.status(503).json({
      message: "Firebase Admin credentials are missing. Add the configured service-account file and restart the backend.",
    });
  }

  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer (.+)$/i);
    if (!match) {
      return res.status(401).json({ message: "Please sign in before adding a patient." });
    }

    const decoded = await auth.verifyIdToken(match[1]);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    const role = String(userDoc.data()?.role || "").toLowerCase().replace(/[\s_-]/g, "");

    // Ensure your admin/staff accounts have a users/{uid} document with an
    // authorized role. Adjust these role labels to match your AuthContext data.
    if (!userDoc.exists || !["admin", "administrator", "staff", "clinicstaff"].includes(role)) {
      return res.status(403).json({ message: "You are not authorized to add patients." });
    }

    req.authUser = decoded;
    next();
  } catch (error) {
    console.error("Verify clinic staff error:", error.message);
    if (error.code?.startsWith("auth/")) {
      return res.status(401).json({ message: "Your session is invalid or expired. Please sign in again." });
    }
    return res.status(503).json({ message: "Unable to verify clinic staff access. Please try again." });
  }
}

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

    // Ensure mail delivery is configured before creating an account.
    const transporter = emailTransporter();
    await transporter.verify();

    // Firebase Auth enforces email uniqueness. The password is never saved to Firestore.
    const temporaryPassword = makeTemporaryPassword();
    const userRecord = await auth.createUser({
      email: patient.email,
      password: temporaryPassword,
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
        mustChangePassword: true,
      });
      transaction.set(db.collection("users").doc(userRecord.uid), {
        ...patient,
        uid: userRecord.uid,
        patientId,
        role: "student",
        status: "ACTIVE",
        createdAt: FieldValue.serverTimestamp(),
        mustChangePassword: true,
      });
      return ref;
    });
    createdPatientId = patientRef.id;

    const loginUrl = process.env.LOGIN_URL || "http://localhost:5173/";
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: patient.email,
        subject: "Your Clinic Management System account",
        text:
`Hello ${patient.firstName},

Your Clinic Management System account has been created.

Patient ID: ${createdPatientId}
Login email: ${patient.email}
Temporary password: ${temporaryPassword}

Sign in here: ${loginUrl}

For your security, sign in and change this temporary password immediately. Do not share your password with anyone.

If you did not expect this account, please contact your school clinic.`,
      });
    } catch (mailError) {
      // Avoid leaving an active account whose credentials were not delivered.
      await db.collection("patients").doc(createdPatientId).delete().catch(() => {});
      await db.collection("users").doc(userRecord.uid).delete().catch(() => {});
      await auth.deleteUser(userRecord.uid).catch(() => {});
      createdUid = null;
      createdPatientId = null;
      throw new Error("The account could not be emailed. Check SMTP settings and try again.", {
        cause: mailError,
      });
    }

    return res.status(201).json({
      message: "Patient and login account created. Temporary login details were emailed to the patient.",
      patient: {
        ...patient,
        id: createdPatientId,
        uid: userRecord.uid,
        role: "student",
        status: "Active",
      },
      emailSent: true,
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

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Clinic backend listening on http://localhost:${port}`);
});
