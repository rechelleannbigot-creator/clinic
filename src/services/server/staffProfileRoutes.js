import { FieldValue } from "firebase-admin/firestore";
import { Buffer } from "node:buffer";

const editableFields = ["firstName", "middleName", "lastName", "gender", "birthDate", "phone", "address", "photoURL"];
const clean = (value) => typeof value === "string" ? value.trim() : "";

function profileForResponse(data, authUser) {
  const nameParts = clean(data.name || authUser.name).split(/\s+/);
  return {
    firstName: data.firstName ?? nameParts[0] ?? "",
    middleName: data.middleName ?? "",
    lastName: data.lastName ?? nameParts.slice(1).join(" "),
    gender: data.gender || data.sex || "",
    birthDate: data.birthDate || data.dateOfBirth || "",
    phone: data.phone || data.contact || "",
    address: data.address || "",
    email: authUser.email || "",
    photoURL: data.photoURL || "",
    employeeId: data.employeeId || data.idNumber || "",
    position: data.position || "",
    department: data.department || "",
    employmentStatus: data.employmentStatus || data.status || "",
    dateHired: data.dateHired || data.hireDate || "",
    role: data.role || "",
  };
}

function validatePhoto(value) {
  if (value === "") return true;
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) return false;
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 200 * 1024 || bytes.toString("base64") !== match[2]) return false;
  if (match[1] === "jpeg") return bytes.length >= 3 && bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (match[1] === "png") return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
}

function normalizeUpdates(body) {
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).some((key) => !editableFields.includes(key)) ||
      editableFields.filter((key) => key !== "photoURL").some((key) => typeof body[key] !== "string") ||
      ("photoURL" in body && typeof body.photoURL !== "string")) {
    throw new Error("Provide only the editable profile fields.");
  }
  const data = Object.fromEntries(editableFields.filter((key) => key in body).map((key) => [key, clean(body[key])]));
  if (!data.firstName || !data.lastName) throw new Error("First and last name are required.");
  if (["firstName", "middleName", "lastName"].some((key) => data[key].length > 100) || data.address.length > 300) {
    throw new Error("A profile field is too long.");
  }
  if (data.phone && (!/^[\d+()\s-]+$/.test(data.phone) || data.phone.replace(/\D/g, "").length < 7 || data.phone.replace(/\D/g, "").length > 15)) {
    throw new Error("Enter a valid contact number containing 7 to 15 digits.");
  }
  if (data.gender.length > 50) throw new Error("Gender is too long.");
  if (data.birthDate) {
    const date = new Date(`${data.birthDate}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate) || Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== data.birthDate || data.birthDate > new Date().toISOString().slice(0, 10)) {
      throw new Error("Enter a valid date of birth that is not in the future.");
    }
  }
  if ("photoURL" in data && !validatePhoto(data.photoURL)) throw new Error("Choose a valid JPEG, PNG, or WebP image no larger than 200 KB.");
  return data;
}

export function registerStaffProfileRoutes(app, { db, requireClinicStaff }) {
  const staffOnly = (req, res, next) => {
    const role = clean(req.staffProfile?.role).toLowerCase().replace(/[\s_-]/g, "");
    if (!["staff", "clinicstaff"].includes(role)) return res.status(403).json({ message: "Only clinic staff can access this profile." });
    next();
  };

  app.get("/api/staff/me/profile", requireClinicStaff, staffOnly, (req, res) => {
    res.json({ profile: profileForResponse(req.staffProfile, req.authUser) });
  });

  app.put("/api/staff/me/profile", requireClinicStaff, staffOnly, async (req, res) => {
    let updates;
    try {
      updates = normalizeUpdates(req.body);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    try {
      await db.collection("users").doc(req.authUser.uid).update({
        ...updates,
        contact: updates.phone,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return res.json({ profile: profileForResponse({ ...req.staffProfile, ...updates }, req.authUser) });
    } catch (error) {
      console.error("Update staff profile error:", error.message);
      return res.status(500).json({ message: "Unable to save your profile. Please try again." });
    }
  });
}
