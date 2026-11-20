export const reportCategories = {
  patients: { title: "Student / Patient Report", date: "createdAt", columns: [
    ["id", "Patient ID"], ["name", "Full Name"], ["gender", "Gender"], ["age", "Age"],
    ["course", "Course / Section"], ["yearLevel", "Year Level"], ["contact", "Contact Number"], ["createdAt", "Registration Date"],
  ] },
  consultations: { title: "Consultation Report", date: "date", columns: [
    ["id", "Consultation ID"], ["patientName", "Patient Name"], ["date", "Consultation Date"], ["type", "Consultation Type"],
    ["staff", "Clinic Staff"], ["symptoms", "Symptoms"], ["diagnosis", "Diagnosis"], ["treatment", "Treatment"], ["remarks", "Remarks"],
  ] },
  medicines: { title: "Medicine Inventory Report", date: "createdAt", columns: [
    ["id", "Medicine ID"], ["name", "Medicine Name"], ["category", "Category"], ["quantity", "Available Stock"],
    ["unit", "Unit"], ["expirationDate", "Expiration Date"], ["status", "Stock Status"],
  ] },
  issuances: { title: "Medicine Issuance Report", date: "date", columns: [
    ["id", "Issuance ID"], ["patientName", "Patient Name"], ["medicine", "Medicine Name"], ["quantity", "Quantity Issued"],
    ["date", "Date Issued"], ["staff", "Issued By"], ["instructions", "Instructions"],
  ] },
  transactions: { title: "Clinic Transaction Activity Report", date: "date", columns: [
    ["id", "Event Reference"], ["patientName", "Patient Name"], ["type", "Transaction Type"], ["date", "Transaction Date"],
    ["staff", "Processed By"], ["description", "Description"],
  ] },
  staff: { title: "Clinic Staff Report", date: "createdAt", columns: [
    ["id", "Staff ID"], ["name", "Staff Name"], ["email", "Email Address"], ["role", "Assigned Role"],
    ["status", "Account Status"], ["createdAt", "Date Registered"],
  ] },
};

export const emptyFilters = { search: "", start: "", end: "", consultationType: "", staff: "", medicine: "", transactionType: "" };

export function calendarDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

export function displayValue(key, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (["date", "createdAt", "expirationDate"].includes(key)) {
    const date = calendarDate(value);
    if (!date) return String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-PH", { timeZone: "UTC", dateStyle: "medium" });
    }
    return new Date(value).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });
  }
  return String(value);
}

export function filterRecords(records, category, filters) {
  const term = filters.search.trim().toLowerCase();
  return records.filter((row) => {
    const date = calendarDate(row[reportCategories[category].date]);
    return (!term || [row.patientName, row.patientId, row.studentId, category === "patients" ? row.name : "", category === "patients" ? row.id : ""]
      .some((value) => String(value || "").toLowerCase().includes(term))) &&
      (!(filters.start || filters.end) || (date && (!filters.start || date >= filters.start) && (!filters.end || date <= filters.end))) &&
      (!filters.consultationType || row.type === filters.consultationType) &&
      (!filters.staff || row.staff === filters.staff) &&
      (!filters.medicine || (category === "medicines" ? row.name : row.medicine) === filters.medicine) &&
      (!filters.transactionType || row.type === filters.transactionType);
  });
}
