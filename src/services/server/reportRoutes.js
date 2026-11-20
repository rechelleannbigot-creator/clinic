import { legacyRecord } from "./issuanceRoutes.js";
import { staffForResponse } from "./adminStaffRoutes.js";

const nameOf = (item) => [item.firstName, item.middleName, item.lastName].filter(Boolean).join(" ");
const dateOf = (value) => {
  if (!value) return "";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

export function registerReportRoutes(app, { db, auth, requireAdmin }) {
  app.get("/api/admin/reports", requireAdmin, async (req, res) => {
    try {
      const [patientsSnap, visitsSnap, medicinesSnap, issuancesSnap, usersSnap] = await Promise.all(
        ["patients", "consultations", "medicines", "medicineIssuances", "users"]
          .map((name) => db.collection(name).get()),
      );
      const patientMap = new Map(patientsSnap.docs.map((doc) => [doc.id, doc.data()]));
      const patients = patientsSnap.docs.map((doc) => {
        const item = doc.data();
        return { id: doc.id, studentId: item.studentId || item.studentNumber || "", name: nameOf(item),
          gender: item.gender || "", age: item.age ?? "", course: item.course || item.section || "",
          yearLevel: item.yearLevel || "", contact: item.contact || "", createdAt: dateOf(item.createdAt),
          createdBy: item.createdByName || "" };
      });
      const consultations = visitsSnap.docs.map((doc) => {
        const item = doc.data();
        const patient = patientMap.get(item.patientId) || {};
        return { id: item.consultationId || doc.id, patientId: item.patientId || "",
          studentId: patient.studentId || patient.studentNumber || "", patientName: item.patientName || nameOf(patient),
          date: item.consultationDate || "", createdAt: dateOf(item.createdAt),
          type: item.consultationType || "", staff: item.clinicStaff || "", symptoms: item.symptoms || "",
          diagnosis: item.diagnosis || "", treatment: item.treatment || "", remarks: item.notes || "" };
      });
      const medicines = medicinesSnap.docs.map((doc) => {
        const item = doc.data();
        const quantity = item.quantity;
        const reorderLevel = item.reorderLevel;
        const valid = Number.isSafeInteger(quantity) && quantity >= 0 &&
          Number.isSafeInteger(reorderLevel) && reorderLevel >= 0;
        return { id: doc.id, name: item.name || "", category: item.category || "",
          quantity: quantity ?? "", unit: item.unit || "", expirationDate: item.expirationDate || item.expiry || "",
          createdAt: dateOf(item.createdAt), lowStock: valid && quantity <= reorderLevel,
          status: !valid ? "Unknown" : quantity === 0 ? "Out of Stock" : quantity <= reorderLevel ? "Low Stock" : "In Stock" };
      });
      const issuanceDocs = [
        ...issuancesSnap.docs.map((doc) => ({ ...doc.data(), issuanceId: doc.id })),
        ...visitsSnap.docs.filter((doc) => doc.data().medicineId && Number.isSafeInteger(doc.data().quantity) && doc.data().quantity > 0)
          .map((doc) => legacyRecord(doc, patientMap)),
      ];
      const issuances = issuanceDocs.map((item) => ({
        id: item.issuanceId, patientId: item.patientId || "", studentId: item.studentId || "",
        patientName: item.patientName || "", medicine: item.medicineName || "", quantity: item.quantity ?? "",
        date: dateOf(item.createdAt), staff: item.issuedBy || "", instructions: item.instructions || "",
      }));
      const staffDocs = usersSnap.docs.filter((doc) =>
        ["staff", "clinicstaff"].includes(String(doc.data().role || "").toLowerCase().replace(/[\s_-]/g, "")));
      const staff = await Promise.all(staffDocs.map(async (doc) => {
        const item = staffForResponse(doc.id, doc.data(), await auth.getUser(doc.id));
        return { id: item.staffId || item.uid, name: item.name, email: item.email, role: item.position,
          status: item.status, createdAt: item.createdAt };
      }));
      const transactions = [
        ...patients.map((item) => ({ id: `registration-${item.id}`, patientId: item.id, studentId: item.studentId,
          patientName: item.name, type: "Patient registration", date: item.createdAt, staff: item.createdBy, description: "Patient registered" })),
        ...consultations.map((item) => ({ id: item.id, patientId: item.patientId, studentId: item.studentId,
          patientName: item.patientName, type: "Consultation", date: item.createdAt, staff: item.staff, description: item.type })),
        ...issuances.map((item) => ({ id: `issuance-${item.id}`, patientId: item.patientId, studentId: item.studentId,
          patientName: item.patientName, type: "Medicine issuance", date: item.date, staff: item.staff,
          description: item.medicine ? `Medicine issued: ${item.medicine}` : "Medicine issued" })),
      ];
      res.set("Cache-Control", "no-store");
      return res.json({ patients, consultations, medicines, issuances, transactions, staff });
    } catch (error) {
      console.error("Load admin reports:", error.message);
      return res.status(500).json({ message: "Unable to load reports. Please try again." });
    }
  });
}
