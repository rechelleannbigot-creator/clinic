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
  const staffOnly = (req, res, next) => {
    const role = text(req.staffProfile?.role).toLowerCase().replace(/[\s_-]/g, "");
    if (!["staff", "clinicstaff"].includes(role)) return res.status(403).json({ message: "Only clinic staff can access the staff dashboard." });
    next();
  };
  const timestamp = (value) => {
    if (!value) return "";
    const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  };
  const manilaDate = (date) => new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
  const notificationId = (value) => crypto.createHash("sha256").update(value).digest("hex");

  app.get("/api/staff/dashboard", requireClinicStaff, staffOnly, async (req, res) => {
    try {
      const [patientSnapshot, medicineSnapshot, consultationSnapshot, readSnapshot] = await Promise.all([
        db.collection("patients").get(), medicines.get(), consultations.get(),
        db.collection("staffDashboardReads").doc(req.authUser.uid).collection("notifications").get(),
      ]);
      const today = manilaDate(new Date());
      const expiringLimit = new Date(`${today}T00:00:00Z`);
      expiringLimit.setUTCDate(expiringLimit.getUTCDate() + 30);
      const limit = expiringLimit.toISOString().slice(0, 10);
      const patients = patientSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const stock = medicineSnapshot.docs.map((doc) => {
        const item = doc.data();
        const expiry = item.expirationDate || item.expiry || "";
        let status = "In Stock";
        if (!Number.isSafeInteger(item.quantity) || item.quantity < 0 || !Number.isSafeInteger(item.reorderLevel) || item.reorderLevel < 0 || !validDate(expiry)) status = "Unknown";
        else if (expiry < today) status = "Expired";
        else if (item.quantity === 0) status = "Out of Stock";
        else if (item.quantity <= item.reorderLevel) status = "Low Stock";
        else if (expiry && expiry <= limit) status = "Expiring Soon";
        return { id: doc.id, name: item.name, quantity: item.quantity, unit: item.unit, expirationDate: expiry, status, reorderLevel: item.reorderLevel };
      });
      const visits = consultationSnapshot.docs.map((doc) => {
        const item = doc.data();
        return {
          consultationId: item.consultationId || doc.id, patientName: item.patientName || "",
          consultationType: item.consultationType || "", consultationDate: item.consultationDate || "",
          clinicStaff: item.clinicStaff || "", status: item.status || "Recorded",
          medicine: item.medicine || "", createdAt: timestamp(item.createdAt),
        };
      });
      const activities = [];
      for (const patient of patients) {
        const date = timestamp(patient.createdAt);
        if (date) activities.push({ id: `patient-${patient.id}`, patientName: [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" "), reference: patient.id, description: "Patient registered", date, staff: patient.createdByName || "" });
      }
      for (const visit of visits) {
        if (!visit.createdAt) continue;
        activities.push({ id: `visit-${visit.consultationId}`, patientName: visit.patientName, reference: visit.consultationId, description: "Consultation recorded", date: visit.createdAt, staff: visit.clinicStaff });
        if (visit.medicine) activities.push({ id: `issue-${visit.consultationId}`, patientName: visit.patientName, reference: visit.consultationId, description: `Medicine issued: ${visit.medicine}`, date: visit.createdAt, staff: visit.clinicStaff });
      }
      activities.sort((a, b) => b.date.localeCompare(a.date));
      const notifications = [
        ...stock.filter((item) => (Number.isSafeInteger(item.quantity) && Number.isSafeInteger(item.reorderLevel) && item.quantity <= item.reorderLevel) || (validDate(item.expirationDate) && item.expirationDate <= limit)).map((item) => {
          const alerts = [];
          if (Number.isSafeInteger(item.quantity) && Number.isSafeInteger(item.reorderLevel) && item.quantity <= item.reorderLevel) alerts.push(item.quantity === 0 ? "Out of stock" : "Low stock");
          if (validDate(item.expirationDate) && item.expirationDate <= limit) alerts.push(item.expirationDate < today ? "Expired" : "Expiring within 30 days");
          return { id: notificationId(`stock:${item.id}:${item.quantity}:${item.reorderLevel}:${item.expirationDate}:${alerts.join(",")}`), title: item.name, message: alerts.join(" · "), date: "" };
        }),
        ...activities.filter((item) => item.id.startsWith("patient-") || item.id.startsWith("visit-")).slice(0, 10).map((item) => ({
          id: notificationId(item.id), title: item.description, message: item.patientName || item.reference, date: item.date,
        })),
      ];
      const readIds = new Set(readSnapshot.docs.map((doc) => doc.id));
      res.json({
        stats: {
          patients: patients.length,
          consultationsToday: visits.filter((visit) => visit.consultationDate === today).length,
          availableMedicines: stock.filter((item) => item.status !== "Unknown" && item.quantity > 0 && item.expirationDate >= today).length,
          lowStock: stock.filter((item) => item.status !== "Unknown" && item.quantity <= item.reorderLevel).length,
          issuedToday: visits.filter((visit) => visit.medicine && visit.createdAt && manilaDate(new Date(visit.createdAt)) === today).length,
          medicalRecords: patients.filter((patient) => patient.medicalProfile && typeof patient.medicalProfile === "object" && Object.keys(patient.medicalProfile).length > 0).length,
        },
        consultations: visits.filter((visit) => visit.consultationDate === today).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        medicines: stock, activities: activities.slice(0, 10),
        notifications: notifications.map((item) => ({ ...item, unread: !readIds.has(item.id) })),
      });
    } catch (error) { handleError(res, error, "Load staff dashboard"); }
  });

  app.post("/api/staff/dashboard/notifications/:id/read", requireClinicStaff, staffOnly, async (req, res) => {
    try {
      if (!/^[a-f0-9]{64}$/.test(req.params.id)) throw problem("Invalid notification ID.");
      await db.collection("staffDashboardReads").doc(req.authUser.uid).collection("notifications").doc(req.params.id).set({ readAt: FieldValue.serverTimestamp() });
      res.json({ message: "Notification marked as read." });
    } catch (error) { handleError(res, error, "Mark notification as read"); }
  });

  app.get("/api/staff/dashboard/patients/:id", requireClinicStaff, staffOnly, async (req, res) => {
    try {
      if (!validId(req.params.id)) throw problem("Invalid patient ID.");
      const snapshot = await db.collection("patients").doc(req.params.id).get();
      if (!snapshot.exists) throw problem("No registered patient matches this QR code.", 404);
      const patient = snapshot.data();
      res.json({ patient: { id: snapshot.id, name: [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" "), studentId: patient.studentId || "", course: patient.course || patient.section || "", yearLevel: patient.yearLevel || "" } });
    } catch (error) { handleError(res, error, "Find patient"); }
  });

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
