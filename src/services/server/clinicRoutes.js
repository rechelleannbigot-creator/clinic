import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";

const text = (value) => typeof value === "string" ? value.trim() : "";
const validId = (id) => /^[A-Za-z0-9_-]{1,100}$/.test(id);
const validDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const types = ["General Checkup", "Medical Consultation", "Follow-up", "Follow-up Check", "Emergency Consultation"];

function problem(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function handleError(res, error, operation) {
  console.error(`${operation}:`, error.message);
  return res.status(error.status || 500).json({
    message: error.status ? error.message : `Unable to ${operation.toLowerCase()}. Check the backend logs and try again.`,
  });
}

export function normalizeConsultation(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw problem("A consultation object is required.");
  const data = {
    patientId: text(body.patientId),
    consultationDate: text(body.consultationDate),
    consultationType: text(body.consultationType),
    symptoms: text(body.symptoms),
    diagnosis: text(body.diagnosis),
    treatment: text(body.treatment),
    medicineId: text(body.medicineId),
    dosage: text(body.dosage),
    instructions: text(body.instructions),
    notes: text(body.notes),
    quantity: body.quantity === "" || body.quantity == null ? null : Number(body.quantity),
  };
  if (!validId(data.patientId)) throw problem("Select a valid registered patient.");
  if (!validDate(data.consultationDate)) throw problem("Enter a valid consultation date (YYYY-MM-DD).");
  if (!types.includes(data.consultationType)) throw problem("Select a valid consultation type.");
  if (!data.symptoms || !data.diagnosis) throw problem("Symptoms and diagnosis are required.");
  if (Object.values(data).some((value) => typeof value === "string" && value.length > 5000)) {
    throw problem("A consultation field exceeds the maximum length.");
  }
  if (data.medicineId) {
    if (!validId(data.medicineId) || !Number.isSafeInteger(data.quantity) || data.quantity < 1 ||
        !data.dosage || !data.instructions) {
      throw problem("Select a valid medicine and provide dosage, instructions, and a positive whole-number quantity.");
    }
  } else if (data.quantity !== null || data.dosage || data.instructions) {
    throw problem("Select a medicine or clear its dosage, quantity, and instructions.");
  }
  return data;
}

function normalizeMedicine(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw problem("A medicine object is required.");
  const medicine = {
    name: text(body.name),
    category: text(body.category),
    unit: text(body.unit),
    quantity: Number(body.quantity),
    reorderLevel: body.reorderLevel === "" || body.reorderLevel == null ? 30 : Number(body.reorderLevel),
    expirationDate: text(body.expirationDate || body.expiry),
  };
  if (!medicine.name || !medicine.category || !medicine.unit ||
      body.quantity === "" || body.quantity == null ||
      !Number.isSafeInteger(medicine.quantity) || medicine.quantity < 0 ||
      !Number.isSafeInteger(medicine.reorderLevel) || medicine.reorderLevel < 0 ||
      !validDate(medicine.expirationDate)) {
    throw problem("Enter a medicine name, category, unit, valid expiry date, and non-negative whole-number stock and reorder level.");
  }
  if ([medicine.name, medicine.category, medicine.unit].some((value) => value.length > 200)) {
    throw problem("Medicine details are too long.");
  }
  return medicine;
}

export function registerClinicRoutes(app, { db, requireClinicStaff, requireSignedIn }) {
  const medicines = db.collection("medicines");
  const consultations = db.collection("consultations");

  app.get("/api/medicines", requireClinicStaff, async (_req, res) => {
    try {
      const snapshot = await medicines.get();
      res.json({ medicines: snapshot.docs.map((item) => ({ ...item.data(), id: item.id })) });
    } catch (error) { handleError(res, error, "Load medicines"); }
  });

  app.post("/api/medicines", requireClinicStaff, async (req, res) => {
    try {
      const medicine = normalizeMedicine(req.body);
      const ref = medicines.doc();
      await ref.create({ ...medicine, createdAt: FieldValue.serverTimestamp() });
      res.status(201).json({ medicine: { ...medicine, id: ref.id } });
    } catch (error) { handleError(res, error, "Create medicine"); }
  });

  app.put("/api/medicines/:id", requireClinicStaff, async (req, res) => {
    try {
      if (!validId(req.params.id)) throw problem("Invalid medicine ID.");
      const medicine = normalizeMedicine(req.body);
      const expectedQuantity = Number(req.body.expectedQuantity);
      if (!Number.isSafeInteger(expectedQuantity) || expectedQuantity < 0) throw problem("The original stock quantity is required.");
      const ref = medicines.doc(req.params.id);
      await db.runTransaction(async (tx) => {
        const snapshot = await tx.get(ref);
        if (!snapshot.exists) throw problem("Medicine no longer exists.", 404);
        if (snapshot.data().quantity !== expectedQuantity) throw problem("Stock changed since editing began. Reload inventory and try again.", 409);
        tx.update(ref, { ...medicine, updatedAt: FieldValue.serverTimestamp() });
      });
      res.json({ medicine: { ...medicine, id: ref.id } });
    } catch (error) { handleError(res, error, "Update medicine"); }
  });

  app.delete("/api/medicines/:id", requireClinicStaff, async (req, res) => {
    try {
      if (!validId(req.params.id)) throw problem("Invalid medicine ID.");
      await medicines.doc(req.params.id).delete();
      res.json({ message: "Medicine removed." });
    } catch (error) { handleError(res, error, "Remove medicine"); }
  });

  app.get("/api/consultations", requireClinicStaff, async (req, res) => {
    try {
      const patientId = text(req.query.patientId);
      if (patientId && !validId(patientId)) throw problem("Invalid patient ID.");
      const snapshot = await (patientId ? consultations.where("patientId", "==", patientId) : consultations).get();
      const records = snapshot.docs.map((item) => item.data()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      res.json({ consultations: records });
    } catch (error) { handleError(res, error, "Load consultations"); }
  });

  app.get("/api/my-consultations", requireSignedIn, async (req, res) => {
    try {
      const profile = await db.collection("users").doc(req.authUser.uid).get();
      const patientId = text(profile.data()?.patientId);
      if (!patientId || !validId(patientId)) throw problem("No patient record is linked to this account.", 403);
      const patient = await db.collection("patients").doc(patientId).get();
      if (!patient.exists || patient.data().uid !== req.authUser.uid) throw problem("The patient record is not linked to this account.", 403);
      const snapshot = await consultations.where("patientId", "==", patientId).get();
      res.json({ consultations: snapshot.docs.map((item) => item.data()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
    } catch (error) { handleError(res, error, "Load your consultations"); }
  });

  app.post("/api/consultations", requireClinicStaff, async (req, res) => {
    try {
      const requestId = text(req.body?.requestId);
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
        throw problem("A valid unique request ID is required.");
      }
      const data = normalizeConsultation(req.body);
      const fingerprint = crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
      const consultationId = `CON-${requestId}`;
      const ref = consultations.doc(consultationId);
      const patientRef = db.collection("patients").doc(data.patientId);
      const medicineRef = data.medicineId ? medicines.doc(data.medicineId) : null;
      const profile = req.staffProfile;
      const staffName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ") ||
        text(profile.name) || text(req.authUser.name) || text(req.authUser.email);
      if (!staffName) throw problem("Your staff profile needs a name or email before saving.", 409);
      const result = await db.runTransaction(async (tx) => {
        const existing = await tx.get(ref);
        if (existing.exists) {
          const record = existing.data();
          if (record.staffUid !== req.authUser.uid || record.requestFingerprint !== fingerprint) {
            throw problem("This request ID was already used for a different consultation. Start a new form.", 409);
          }
          return record;
        }
        const patient = await tx.get(patientRef);
        if (!patient.exists) throw problem("The selected patient no longer exists.", 404);
        const medicine = medicineRef ? await tx.get(medicineRef) : null;
        if (medicineRef && !medicine.exists) throw problem("The selected medicine no longer exists.", 409);
        const stock = medicine?.data();
        if (stock) {
          if (!Number.isSafeInteger(stock.quantity) || stock.quantity < data.quantity) throw problem("Insufficient medicine stock. Reload inventory and try again.", 409);
          const expiry = stock.expirationDate || stock.expiry;
          const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
          if (!validDate(expiry) || expiry < today) throw problem("This medicine has expired or has an invalid expiry date.", 409);
        }
        const patientData = patient.data();
        const record = {
          ...data, consultationId,
          patientName: [patientData.firstName, patientData.middleName, patientData.lastName].filter(Boolean).join(" "),
          patientUid: patientData.uid || "",
          clinicStaff: staffName, staffUid: req.authUser.uid,
          medicine: stock?.name || "",
          createdAt: new Date().toISOString(),
          requestFingerprint: fingerprint,
        };
        if (medicineRef) tx.update(medicineRef, { quantity: stock.quantity - data.quantity, updatedAt: FieldValue.serverTimestamp() });
        tx.create(ref, record);
        return record;
      });
      res.status(201).json({ consultation: result });
    } catch (error) { handleError(res, error, "Save consultation"); }
  });

  app.delete("/api/consultations/:id", requireClinicStaff, async (req, res) => {
    try {
      if (!validId(req.params.id)) throw problem("Invalid consultation ID.");
      const ref = consultations.doc(req.params.id);
      await db.runTransaction(async (tx) => {
        const snapshot = await tx.get(ref);
        if (!snapshot.exists) throw problem("This visit record no longer exists.", 404);
        tx.delete(ref);
      });
      res.json({ message: "Visit record deleted." });
    } catch (error) { handleError(res, error, "Delete consultation"); }
  });
}
