import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";

const text = (value) => typeof value === "string" ? value.trim() : "";
const normalizedRole = (value) => text(value).toLowerCase().replace(/[\s_-]/g, "");
const staffRoles = new Set(["staff", "clinicstaff"]);
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validPhone = /^[\d\s()+-]*$/;

function problem(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function handleError(res, error, action) {
  console.error(`${action}:`, error.message);
  if (error.status) return res.status(error.status).json({ message: error.message });
  if (error.code === "auth/email-already-exists") {
    return res.status(409).json({ message: "That email address is already associated with an account." });
  }
  if (error.code === "auth/user-not-found") {
    return res.status(404).json({ message: "The staff account could not be found." });
  }
  return res.status(500).json({ message: `Unable to ${action.toLowerCase()}. Please try again.` });
}

function normalizeStaff(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw problem("Staff information is required.");
  const staff = {
    firstName: text(body.firstName),
    middleName: text(body.middleName),
    lastName: text(body.lastName),
    email: text(body.email).toLowerCase(),
    phone: text(body.phone || body.contact),
    gender: text(body.gender),
    position: text(body.position),
    status: text(body.status || "ACTIVE").toUpperCase(),
  };
  if (!staff.firstName || !staff.lastName || !staff.position || !staff.email) {
    throw problem("First name, last name, email, and position are required.");
  }
  if (!validEmail.test(staff.email)) throw problem("Enter a valid email address.");
  if (staff.phone && (!validPhone.test(staff.phone) || staff.phone.replace(/\D/g, "").length < 7 || staff.phone.replace(/\D/g, "").length > 15)) {
    throw problem("Enter a valid contact number containing 7 to 15 digits.");
  }
  if (!["ACTIVE", "INACTIVE"].includes(staff.status)) throw problem("Status must be Active or Inactive.");
  if ([staff.firstName, staff.middleName, staff.lastName, staff.position].some((value) => value.length > 100)) {
    throw problem("A staff field exceeds the maximum length.");
  }
  if (staff.phone.length > 30 || staff.gender.length > 50) throw problem("A staff field exceeds the maximum length.");
  return staff;
}

function dateValue(value) {
  if (!value) return "";
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export function staffForResponse(uid, data, authUser = null, temporaryPassword = null) {
  const createdAt = dateValue(data.createdAt);
  const createdAtMs = createdAt ? new Date(createdAt).getTime() : NaN;
  const now = Date.now();
  const response = {
    uid,
    staffId: data.staffId || data.employeeId || "",
    firstName: data.firstName || "",
    middleName: data.middleName || "",
    lastName: data.lastName || "",
    name: [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" "),
    email: authUser?.email || data.email || "",
    phone: data.phone || data.contact || "",
    gender: data.gender || data.sex || "",
    position: data.position || "Clinic Staff",
    department: data.department || "School Clinic",
    status: (authUser?.disabled || String(data.status).toUpperCase() === "INACTIVE") ? "Inactive" : "Active",
    createdAt,
    recentlyAdded: Number.isFinite(createdAtMs) && createdAtMs <= now && now - createdAtMs <= 30 * 24 * 60 * 60 * 1000,
    lastLogin: authUser?.metadata?.lastSignInTime || "",
  };
  if (temporaryPassword) {
    response.temporaryPassword = temporaryPassword;
  }
  return response;
}

function makeTemporaryPassword() {
  return String(crypto.randomInt(0, 100000000)).padStart(8, "0");
}

async function getStaffRecord(db, uid) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(uid)) throw problem("Invalid staff account ID.");
  const snapshot = await db.collection("users").doc(uid).get();
  if (!snapshot.exists || !staffRoles.has(normalizedRole(snapshot.data().role))) {
    throw problem("Staff account not found.", 404);
  }
  return { ref: snapshot.ref, data: snapshot.data() };
}

export function registerAdminStaffRoutes(app, { db, auth, requireAdmin }) {
  const users = db.collection("users");
  const staffOnly = async (req, res, next) => {
    try {
      const { data } = await getStaffRecord(db, req.params.uid);
      req.targetStaff = data;
      next();
    } catch (error) {
      handleError(res, error, "Load staff account");
    }
  };

  app.get("/api/admin/staff", requireAdmin, async (_req, res) => {
    try {
      const snapshot = await users.get();
      const staffDocs = snapshot.docs.filter((doc) => staffRoles.has(normalizedRole(doc.data().role)));
      const records = await Promise.all(staffDocs.map(async (doc) =>
        staffForResponse(doc.id, doc.data(), await auth.getUser(doc.id))));
      records.sort((a, b) => a.name.localeCompare(b.name));
      return res.json({ staff: records });
    } catch (error) {
      return handleError(res, error, "Load staff");
    }
  });

  app.get("/api/admin/staff/:uid", requireAdmin, staffOnly, async (req, res) => {
    try {
      const authUser = await auth.getUser(req.params.uid);
      return res.json({ staff: staffForResponse(req.params.uid, req.targetStaff, authUser) });
    } catch (error) {
      return handleError(res, error, "Load staff profile");
    }
  });

  app.post("/api/admin/staff", requireAdmin, async (req, res) => {
    let createdUid = null;
    let temporaryPassword = null;
    try {
      const staff = normalizeStaff(req.body);
      temporaryPassword = makeTemporaryPassword();
      const authUser = await auth.createUser({
        email: staff.email,
        password: temporaryPassword,
        displayName: [staff.firstName, staff.middleName, staff.lastName].filter(Boolean).join(" "),
        disabled: staff.status === "INACTIVE",
        emailVerified: false,
      });
      createdUid = authUser.uid;

      const counterRef = db.collection("systemCounters").doc("staff");
      const snapshot = await users.get();
      const existingMax = snapshot.docs.reduce((highest, doc) => {
        const role = normalizedRole(doc.data().role);
        const match = role && staffRoles.has(role) && /^S-\d+$/.exec(text(doc.data().staffId || doc.data().employeeId));
        return match ? Math.max(highest, Number(match[0].slice(2))) : highest;
      }, 0);

      const staffId = await db.runTransaction(async (tx) => {
        const counter = await tx.get(counterRef);
        const next = Math.max(Number(counter.data()?.lastNumber || 0), existingMax) + 1;
        const nextStaffId = `S-${String(next).padStart(3, "0")}`;
        tx.set(counterRef, { lastNumber: next }, { merge: true });
        tx.create(users.doc(createdUid), {
          ...staff,
          uid: createdUid,
          staffId: nextStaffId,
          role: "clinicstaff",
          department: "School Clinic",
          contact: staff.phone,
          createdAt: FieldValue.serverTimestamp(),
          createdBy: req.authUser.uid,
          updatedAt: FieldValue.serverTimestamp(),
        });
        return nextStaffId;
      });
      const createdAt = new Date().toISOString();

      return res.status(201).json({
        staff: staffForResponse(createdUid, {
          ...staff,
          staffId,
          role: "clinicstaff",
          department: "School Clinic",
          createdAt,
        }, authUser, temporaryPassword),
      });
    } catch (error) {
      if (createdUid) {
        try {
          await auth.deleteUser(createdUid);
        } catch (cleanupError) {
          console.error("Remove incomplete staff auth account error:", cleanupError.message);
        }
      }
      return handleError(res, error, "Create staff account");
    }
  });

  app.put("/api/admin/staff/:uid", requireAdmin, staffOnly, async (req, res) => {
    let authUser;
    let updatedAuth = false;
    try {
      const staff = normalizeStaff(req.body);
      const { ref, data: previous } = await getStaffRecord(db, req.params.uid);
      authUser = await auth.getUser(req.params.uid);
      const displayName = [staff.firstName, staff.middleName, staff.lastName].filter(Boolean).join(" ");
      const authUpdates = {
        displayName,
        disabled: staff.status === "INACTIVE",
      };
      if (staff.email !== authUser.email) {
        authUpdates.email = staff.email;
        authUpdates.emailVerified = false;
      }
      await auth.updateUser(req.params.uid, authUpdates);
      updatedAuth = true;
      await ref.update({
        ...staff,
        contact: staff.phone,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: req.authUser.uid,
      });
      return res.json({ staff: staffForResponse(req.params.uid, { ...previous, ...staff }, { ...authUser, ...authUpdates }) });
    } catch (error) {
      if (updatedAuth && authUser) {
        try {
          await auth.updateUser(req.params.uid, {
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            displayName: authUser.displayName,
            disabled: authUser.disabled,
          });
        } catch (rollbackError) {
          console.error("Restore staff authentication account error:", rollbackError.message);
        }
      }
      return handleError(res, error, "Update staff account");
    }
  });

  app.delete("/api/admin/staff/:uid", requireAdmin, staffOnly, async (req, res) => {
    try {
      const { ref, data } = await getStaffRecord(db, req.params.uid);
      await ref.delete();
      try {
        await auth.deleteUser(req.params.uid);
      } catch (error) {
        try {
          await ref.create(data);
        } catch (restoreError) {
          console.error("Restore staff Firestore document after delete error:", restoreError.message);
          return res.status(500).json({ message: "Staff account deletion failed and its profile could not be restored. Contact support." });
        }
        throw error;
      }
      return res.json({ message: "Staff account deleted." });
    } catch (error) {
      return handleError(res, error, "Delete staff account");
    }
  });
}
