import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";

const text = (value) => typeof value === "string" ? value.trim() : "";
const validId = (value) => /^[A-Za-z0-9_-]{1,100}$/.test(value);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const problem = (message, status = 400) => Object.assign(new Error(message), { status });
const today = () => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());
const patientName = (patient) => [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ");

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalize(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw problem("An issuance object is required.");
  if ((typeof body.quantity !== "number" && typeof body.quantity !== "string") ||
      (typeof body.quantity === "string" && !/^\d+$/.test(body.quantity.trim()))) {
    throw problem("Quantity must be a positive whole number.");
  }
  const data = {
    patientId: text(body.patientId), medicineId: text(body.medicineId),
    quantity: body.quantity === "" || body.quantity == null ? NaN : Number(body.quantity),
    dosage: text(body.dosage), instructions: text(body.instructions), reason: text(body.reason),
  };
  if (!validId(data.patientId) || !validId(data.medicineId)) throw problem("Select a registered student and medicine.");
  if (!Number.isSafeInteger(data.quantity) || data.quantity < 1) throw problem("Quantity must be a positive whole number.");
  if (!data.dosage || !data.instructions || !data.reason) throw problem("Dosage, instructions, and reason are required.");
  if ([data.dosage, data.instructions, data.reason].some((value) => value.length > 5000)) throw problem("An issuance field is too long.");
  return data;
}

export function legacyRecord(doc, patients) {
  const item = doc.data();
  const patient = patients.get(item.patientId) || {};
  return {
    issuanceId: item.consultationId || doc.id, patientId: item.patientId,
    studentId: patient.studentId || patient.studentNumber || "",
    patientName: item.patientName || patientName(patient),
    course: patient.course || patient.section || "", yearLevel: patient.yearLevel || "",
    medicineId: item.medicineId, medicineName: item.medicine, quantity: item.quantity,
    unit: "", dosage: item.dosage, instructions: item.instructions,
    reason: item.diagnosis, createdAt: item.createdAt, issuedBy: item.clinicStaff,
    source: "consultation",
  };
}

export function registerIssuanceRoutes(app, { db, requireClinicStaff }) {
  const issuances = db.collection("medicineIssuances");
  const consultations = db.collection("consultations");
  const patients = db.collection("patients");
  const medicines = db.collection("medicines");
  const fail = (res, error, operation) => {
    console.error(`${operation}:`, error.message);
    return res.status(error.status || 500).json({ message: error.status ? error.message : `Unable to ${operation.toLowerCase()}. Check the backend logs and try again.` });
  };

  app.get("/api/medicine-issuances", requireClinicStaff, async (req, res) => {
    try {
      const patientId = text(req.query.patientId);
      if (patientId && !validId(patientId)) throw problem("Invalid patient ID.");
      const [issued, visits, patientSnapshot] = await Promise.all([
        (patientId ? issuances.where("patientId", "==", patientId) : issuances).get(),
        (patientId ? consultations.where("patientId", "==", patientId) : consultations).get(),
        patients.get(),
      ]);
      const patientMap = new Map(patientSnapshot.docs.map((doc) => [doc.id, doc.data()]));
      const records = [
        ...issued.docs.map((doc) => ({ ...doc.data(), issuanceId: doc.id })),
        ...visits.docs.filter((doc) => doc.data().medicineId && Number.isSafeInteger(doc.data().quantity) && doc.data().quantity > 0)
          .map((doc) => legacyRecord(doc, patientMap)),
      ].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      res.json({ issuances: records });
    } catch (error) { fail(res, error, "Load medicine issuances"); }
  });

  app.get("/api/medicine-issuances/:id", requireClinicStaff, async (req, res) => {
    try {
      const id = text(req.params.id);
      if (!validId(id)) throw problem("Invalid issuance ID.");
      const issued = await issuances.doc(id).get();
      if (issued.exists) return res.json({ issuance: { ...issued.data(), issuanceId: issued.id } });
      const visit = await consultations.doc(id).get();
      if (!visit.exists || !visit.data().medicineId || !Number.isSafeInteger(visit.data().quantity) || visit.data().quantity < 1) throw problem("Issuance not found.", 404);
      const patient = await patients.doc(visit.data().patientId).get();
      return res.json({ issuance: legacyRecord(visit, new Map(patient.exists ? [[patient.id, patient.data()]] : [])) });
    } catch (error) { return fail(res, error, "Load issuance details"); }
  });

  app.post("/api/medicine-issuances", requireClinicStaff, async (req, res) => {
    try {
      const requestId = text(req.body?.requestId);
      if (!uuid.test(requestId)) throw problem("A valid unique request ID is required.");
      const data = normalize(req.body);
      const fingerprint = crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
      const ref = issuances.doc(`ISS-${requestId}`);
      const patientRef = patients.doc(data.patientId);
      const medicineRef = medicines.doc(data.medicineId);
      const profile = req.staffProfile;
      const issuedBy = patientName(profile) || text(profile.name) || text(req.authUser.name) || text(req.authUser.email);
      if (!issuedBy) throw problem("Your staff profile needs a name or email before saving.", 409);
      const record = await db.runTransaction(async (tx) => {
        const existing = await tx.get(ref);
        if (existing.exists) {
          const previous = existing.data();
          if (previous.staffUid !== req.authUser.uid || previous.requestFingerprint !== fingerprint) throw problem("This request ID was already used for a different issuance.", 409);
          return previous;
        }
        const patient = await tx.get(patientRef);
        const medicine = await tx.get(medicineRef);
        if (!patient.exists) throw problem("The selected student no longer exists.", 404);
        if (!medicine.exists) throw problem("The selected medicine no longer exists.", 409);
        const student = patient.data();
        const stock = medicine.data();
        if (!Number.isSafeInteger(stock.quantity) || stock.quantity < data.quantity) throw problem("Insufficient medicine stock. Reload inventory and try again.", 409);
        const expiry = stock.expirationDate || stock.expiry || "";
        if (!validDate(expiry) || expiry < today()) throw problem("This medicine has expired or has an invalid expiry date.", 409);
        const result = {
          ...data, issuanceId: ref.id,
          studentId: text(student.studentId) || text(student.studentNumber),
          patientName: patientName(student), course: text(student.course) || text(student.section),
          yearLevel: text(student.yearLevel), medicineName: text(stock.name), unit: text(stock.unit),
          issuedBy, staffUid: req.authUser.uid, createdAt: new Date().toISOString(),
          requestFingerprint: fingerprint, source: "issuance",
        };
        tx.create(ref, result);
        tx.update(medicineRef, { quantity: stock.quantity - data.quantity, updatedAt: FieldValue.serverTimestamp() });
        return result;
      });
      res.status(201).json({ issuance: record });
    } catch (error) { fail(res, error, "Save medicine issuance"); }
  });
}
