const text = (value) => typeof value === "string" ? value.trim() : "";

function parseDateRange(startStr, endStr) {
  const start = new Date(`${startStr}T00:00:00Z`);
  const end = new Date(`${endStr}T23:59:59Z`);
  return { start, end };
}

function isDateInRange(date, startDate, endDate) {
  if (!date) return false;
  const dateObj = typeof date.toDate === "function" ? date.toDate() : new Date(date);
  return dateObj >= startDate && dateObj <= endDate;
}

function getMonthKey(date) {
  if (!date) return null;
  const dateObj = typeof date.toDate === "function" ? date.toDate() : new Date(date);
  if (Number.isNaN(dateObj.getTime())) return null;
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getDayKey(date) {
  if (!date) return null;
  const dateObj = typeof date.toDate === "function" ? date.toDate() : new Date(date);
  if (Number.isNaN(dateObj.getTime())) return null;
  return dateObj.toISOString().split("T")[0];
}

export function registerAnalyticsRoutes(app, { db, requireAdmin }) {
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const startDate = text(req.query.startDate) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const endDate = text(req.query.endDate) || new Date().toISOString().split("T")[0];
      
      const { start, end } = parseDateRange(startDate, endDate);

      // Fetch all collections
      const [patientsSnap, consultationsSnap, medicinesSnap, issuancesSnap, usersSnap] = await Promise.all([
        db.collection("patients").get(),
        db.collection("consultations").get(),
        db.collection("medicines").get(),
        db.collection("medicineIssuances").get(),
        db.collection("users").get(),
      ]);

      // ============================================================
      // 1. OVERVIEW STATISTICS
      // ============================================================
      const patients = patientsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const consultations = consultationsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const medicines = medicinesSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const issuances = issuancesSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const users = usersSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      // Total registered students
      const totalStudents = patients.length;

      // Students by gender
      const studentsByGender = {
        Male: patients.filter((p) => p.gender === "Male").length,
        Female: patients.filter((p) => p.gender === "Female").length,
        Other: patients.filter((p) => p.gender && !["Male", "Female"].includes(p.gender)).length,
      };

      // Students by year level
      const studentsByYearLevel = {};
      patients.forEach((p) => {
        if (p.yearLevel) {
          studentsByYearLevel[p.yearLevel] = (studentsByYearLevel[p.yearLevel] || 0) + 1;
        }
      });

      // Students by course (for college) or section (for high school)
      const studentsByCourse = {};
      patients.forEach((p) => {
        const courseOrSection = p.course || p.section || "Unspecified";
        studentsByCourse[courseOrSection] = (studentsByCourse[courseOrSection] || 0) + 1;
      });

      // Consultations in date range
      const consultationsInRange = consultations.filter((c) => isDateInRange(c.createdAt || c.consultationDate, start, end));
      const totalConsultations = consultationsInRange.length;

      // Medicines statistics
      const totalMedicineTypes = medicines.length;
      const totalMedicineQuantity = medicines.reduce((sum, m) => sum + (Number(m.quantity) || 0), 0);
      const lowStockMedicines = medicines.filter((m) => {
        const qty = Number(m.quantity) || 0;
        const reorder = Number(m.reorderLevel) || 30;
        return qty <= reorder;
      }).length;
      const outOfStockMedicines = medicines.filter((m) => Number(m.quantity) === 0).length;
      const expiredMedicines = medicines.filter((m) => {
        if (!m.expirationDate && !m.expiry) return false;
        const expiry = m.expirationDate || m.expiry;
        const expiryDate = new Date(`${expiry}T23:59:59Z`);
        return expiryDate < new Date();
      }).length;
      const expiringMedicines = medicines.filter((m) => {
        if (!m.expirationDate && !m.expiry) return false;
        const expiry = m.expirationDate || m.expiry;
        const expiryDate = new Date(`${expiry}T23:59:59Z`);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate > new Date() && expiryDate <= thirtyDaysFromNow;
      }).length;

      // Medicines issued in date range
      const issuancesInRange = issuances.filter((i) => isDateInRange(i.createdAt, start, end));
      // Also include legacy consultations with medicine data
      const legacyIssuances = consultationsInRange.filter((c) => c.medicineId && Number(c.quantity) > 0);
      const totalMedicineIssued = issuancesInRange.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0) +
        legacyIssuances.reduce((sum, c) => sum + (Number(c.quantity) || 0), 0);

      // Clinic staff statistics
      const staffUsers = users.filter((u) => ["staff", "clinicstaff"].includes(String(u.role || "").toLowerCase().replace(/[\s_-]/g, "")));
      const totalStaff = staffUsers.length;
      const activeStaff = staffUsers.filter((s) => s.status === "Active" || s.status === "ACTIVE").length;
      const inactiveStaff = totalStaff - activeStaff;

      // ============================================================
      // 2. CONSULTATION ANALYTICS
      // ============================================================
      
      // Monthly consultation trends
      const monthlyConsultations = {};
      const monthlyPatientRegistrations = {};
      
      consultationsInRange.forEach((c) => {
        const month = getMonthKey(c.createdAt || c.consultationDate);
        if (month) {
          monthlyConsultations[month] = (monthlyConsultations[month] || 0) + 1;
        }
      });

      patients.forEach((p) => {
        const month = getMonthKey(p.createdAt);
        if (month && isDateInRange(p.createdAt, start, end)) {
          monthlyPatientRegistrations[month] = (monthlyPatientRegistrations[month] || 0) + 1;
        }
      });

      // Daily consultation activity
      const dailyConsultations = {};
      consultationsInRange.forEach((c) => {
        const day = getDayKey(c.createdAt || c.consultationDate);
        if (day) {
          dailyConsultations[day] = (dailyConsultations[day] || 0) + 1;
        }
      });

      // Consultation types distribution
      const consultationTypes = {};
      consultationsInRange.forEach((c) => {
        const type = c.consultationType || "Other";
        consultationTypes[type] = (consultationTypes[type] || 0) + 1;
      });

      // Common diagnoses
      const diagnosisList = {};
      consultationsInRange.forEach((c) => {
        if (c.diagnosis) {
          const diagnosis = c.diagnosis;
          diagnosisList[diagnosis] = (diagnosisList[diagnosis] || 0) + 1;
        }
      });

      // Common symptoms
      const symptomsList = {};
      consultationsInRange.forEach((c) => {
        if (c.symptoms) {
          const symptoms = c.symptoms.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
          symptoms.forEach((symptom) => {
            symptomsList[symptom] = (symptomsList[symptom] || 0) + 1;
          });
        }
      });

      // ============================================================
      // 3. MEDICINE INVENTORY ANALYTICS
      // ============================================================

      // Medicine stock distribution
      const medicineStockDistribution = medicines.map((m) => ({
        name: m.name,
        quantity: Number(m.quantity) || 0,
        unit: m.unit || "",
        category: m.category || "",
        reorderLevel: Number(m.reorderLevel) || 30,
        expirationDate: m.expirationDate || m.expiry || "",
      })).sort((a, b) => b.quantity - a.quantity);

      // Medicines approaching expiration
      const expiringMedicinesList = medicines.filter((m) => {
        const expiry = m.expirationDate || m.expiry;
        if (!expiry) return false;
        const expiryDate = new Date(`${expiry}T23:59:59Z`);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate > new Date() && expiryDate <= thirtyDaysFromNow;
      }).map((m) => ({
        name: m.name,
        expirationDate: m.expirationDate || m.expiry || "",
        quantity: Number(m.quantity) || 0,
      }));

      // Monthly medicine issuance trends
      const monthlyIssuances = {};
      issuancesInRange.forEach((i) => {
        const month = getMonthKey(i.createdAt);
        if (month) {
          monthlyIssuances[month] = (monthlyIssuances[month] || 0) + (Number(i.quantity) || 0);
        }
      });
      legacyIssuances.forEach((c) => {
        const month = getMonthKey(c.createdAt || c.consultationDate);
        if (month) {
          monthlyIssuances[month] = (monthlyIssuances[month] || 0) + (Number(c.quantity) || 0);
        }
      });

      // Most frequently issued medicines
      const issuedMedicines = {};
      issuancesInRange.forEach((i) => {
        const medicineName = i.medicineName || i.medicine || "Unknown";
        issuedMedicines[medicineName] = (issuedMedicines[medicineName] || 0) + (Number(i.quantity) || 0);
      });
      legacyIssuances.forEach((c) => {
        const medicineName = c.medicine || "Unknown";
        issuedMedicines[medicineName] = (issuedMedicines[medicineName] || 0) + (Number(c.quantity) || 0);
      });

      // ============================================================
      // 4. CLINIC STAFF ANALYTICS
      // ============================================================

      // Consultations per staff member
      const consultationsByStaff = {};
      consultationsInRange.forEach((c) => {
        const staff = c.clinicStaff || "Unknown";
        consultationsByStaff[staff] = (consultationsByStaff[staff] || 0) + 1;
      });

      // ============================================================
      // 5. INSIGHTS
      // ============================================================

      const insights = [];

      // Month with highest consultations
      const maxMonth = Object.entries(monthlyConsultations).reduce((max, [month, count]) => count > max[1] ? [month, count] : max, ["", 0]);
      if (maxMonth[1] > 0) {
        const monthName = new Date(`${maxMonth[0]}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
        insights.push(`${monthName} had the highest number of consultations with ${maxMonth[1]} records.`);
      }

      // Most frequent diagnosis
      const topDiagnosis = Object.entries(diagnosisList).sort((a, b) => b[1] - a[1])[0];
      if (topDiagnosis) {
        insights.push(`The most common diagnosis is "${topDiagnosis[0]}" with ${topDiagnosis[1]} cases.`);
      }

      // Most frequent symptom
      const topSymptom = Object.entries(symptomsList).sort((a, b) => b[1] - a[1])[0];
      if (topSymptom) {
        insights.push(`The most frequently reported symptom is "${topSymptom[0]}" mentioned in ${topSymptom[1]} consultations.`);
      }

      // Most issued medicine
      const topIssuedMedicine = Object.entries(issuedMedicines).sort((a, b) => b[1] - a[1])[0];
      if (topIssuedMedicine) {
        insights.push(`"${topIssuedMedicine[0]}" is the most frequently issued medicine with ${topIssuedMedicine[1]} units.`);
      }

      // Medicines needing restock
      const lowStockList = medicines.filter((m) => {
        const qty = Number(m.quantity) || 0;
        const reorder = Number(m.reorderLevel) || 30;
        return qty <= reorder && qty > 0;
      });
      if (lowStockList.length > 0) {
        insights.push(`${lowStockList.length} medicine(s) have reached low stock levels and need restocking.`);
      }

      // Expired medicines
      if (expiredMedicines > 0) {
        insights.push(`There are ${expiredMedicines} expired medicine(s) in inventory that should be removed.`);
      }

      // Year level with most students
      const topYearLevel = Object.entries(studentsByYearLevel).sort((a, b) => b[1] - a[1])[0];
      if (topYearLevel) {
        insights.push(`${topYearLevel[0]} has the highest number of registered students (${topYearLevel[1]}).`);
      }

      res.json({
        period: { startDate, endDate },
        overview: {
          totalStudents,
          totalConsultations,
          totalMedicineTypes,
          totalMedicineQuantity,
          lowStockMedicines,
          outOfStockMedicines,
          expiredMedicines,
          expiringMedicines,
          totalMedicineIssued,
          totalStaff,
          activeStaff,
          inactiveStaff,
        },
        students: {
          total: totalStudents,
          byGender: studentsByGender,
          byYearLevel: studentsByYearLevel,
          byCourse: studentsByCourse,
          monthlyRegistrations: monthlyPatientRegistrations,
        },
        consultations: {
          total: totalConsultations,
          monthlyTrends: monthlyConsultations,
          dailyActivity: dailyConsultations,
          byType: consultationTypes,
          commonDiagnoses: diagnosisList,
          commonSymptoms: symptomsList,
          byStaff: consultationsByStaff,
        },
        medicines: {
          stockDistribution: medicineStockDistribution,
          monthlyIssuances: monthlyIssuances,
          mostIssuedMedicines: issuedMedicines,
          expiringMedicines: expiringMedicinesList,
        },
        staff: {
          total: totalStaff,
          active: activeStaff,
          inactive: inactiveStaff,
          consultationsByStaff: consultationsByStaff,
        },
        insights,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Load analytics error:", error.message);
      return res.status(500).json({ message: "Unable to load analytics. Please try again." });
    }
  });
}
