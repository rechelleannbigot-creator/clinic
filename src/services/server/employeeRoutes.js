import { FieldValue } from "firebase-admin/firestore";

const text = (value) => typeof value === "string" ? value.trim() : "";
const validId = (id) => /^[A-Za-z0-9_-]{1,100}$/.test(id);
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validPhone = (phone) => /^[\d\s\-\+\(\)]{10,}$/.test(phone.replace(/\s/g, ""));
const createdAtMillis = (value) => {
  const date = typeof value?.toDate === "function" ? value.toDate() : value;
  const millis = date == null ? NaN : new Date(date).getTime();
  return Number.isFinite(millis) ? millis : -Infinity;
};
const validDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

function problem(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function handleError(res, error, operation) {
  console.error(`${operation}:`, error.message);
  return res.status(error.status || 500).json({
    message: error.status ? error.message : `Unable to ${operation.toLowerCase()}. Check the backend logs and try again.`,
  });
}

function normalizeEmployee(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw problem("An employee object is required.");
  const data = {
    name: text(body.name),
    email: text(body.email),
    phone: text(body.phone),
    department: text(body.department),
    role: text(body.role),
    hireDate: text(body.hireDate),
  };
  if (!data.name || data.name.length < 2) throw problem("Employee name is required and must be at least 2 characters.");
  if (!validEmail(data.email)) throw problem("Enter a valid email address.");
  if (!validPhone(data.phone)) throw problem("Enter a valid phone number.");
  if (!data.department) throw problem("Department is required.");
  if (!data.role) throw problem("Role is required.");
  if (!validDate(data.hireDate)) throw problem("Enter a valid hire date (YYYY-MM-DD).");
  if (Object.values(data).some((value) => typeof value === "string" && value.length > 500)) {
    throw problem("An employee field exceeds the maximum length.");
  }
  return data;
}

export function registerEmployeeRoutes(app, { db, requireSignedIn }) {
  const employees = db.collection("employees");

  app.get("/api/employees/me/profile", requireSignedIn, async (req, res) => {
    try {
      const userDoc = await db.collection("users").doc(req.authUser.uid).get();
      if (!userDoc.exists) throw problem("Employee profile not found.", 404);
      
      const userData = userDoc.data();
      const employeeId = userData.employeeId || userData.id;
      
      if (!employeeId) throw problem("No employee ID associated with this account.", 404);
      
      const snapshot = await employees.doc(employeeId).get();
      if (!snapshot.exists) throw problem("Employee record not found.", 404);
      
      res.json({ employee: { id: snapshot.id, ...snapshot.data() } });
    } catch (error) { handleError(res, error, "Load employee profile"); }
  });

  app.get("/api/employees", requireSignedIn, async (req, res) => {
    try {
      const department = text(req.query.department);
      const role = text(req.query.role);
      
      let query = employees;
      if (department) query = query.where("department", "==", department);
      if (role) query = query.where("role", "==", role);
      
      const snapshot = await query.get();
      const records = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => createdAtMillis(b.createdAt) - createdAtMillis(a.createdAt));
      res.json({ employees: records });
    } catch (error) { handleError(res, error, "Load employees"); }
  });

  app.get("/api/employees/:id", requireSignedIn, async (req, res) => {
    try {
      if (!validId(req.params.id)) throw problem("Invalid employee ID.");
      const snapshot = await employees.doc(req.params.id).get();
      if (!snapshot.exists) throw problem("Employee not found.", 404);
      res.json({ employee: { id: snapshot.id, ...snapshot.data() } });
    } catch (error) { handleError(res, error, "Load employee"); }
  });

  app.post("/api/employees", requireSignedIn, async (req, res) => {
    try {
      const employee = normalizeEmployee(req.body);
      const docRef = employees.doc();
      await docRef.set({
        ...employee,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      res.json({ employee: { id: docRef.id, ...employee } });
    } catch (error) { handleError(res, error, "Create employee"); }
  });

  app.put("/api/employees/:id", requireSignedIn, async (req, res) => {
    try {
      if (!validId(req.params.id)) throw problem("Invalid employee ID.");
      const employee = normalizeEmployee(req.body);
      const ref = employees.doc(req.params.id);
      await db.runTransaction(async (tx) => {
        const snapshot = await tx.get(ref);
        if (!snapshot.exists) throw problem("Employee not found.", 404);
        tx.update(ref, { ...employee, updatedAt: FieldValue.serverTimestamp() });
      });
      res.json({ employee: { id: ref.id, ...employee } });
    } catch (error) { handleError(res, error, "Update employee"); }
  });

  app.delete("/api/employees/:id", requireSignedIn, async (req, res) => {
    try {
      if (!validId(req.params.id)) throw problem("Invalid employee ID.");
      await employees.doc(req.params.id).delete();
      res.json({ message: "Employee record deleted." });
    } catch (error) { handleError(res, error, "Delete employee"); }
  });

  app.get("/api/employees-by-department", requireSignedIn, async (req, res) => {
    try {
      const snapshot = await employees.get();
      const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const groupedByDept = records.reduce((acc, emp) => {
        const dept = emp.department || "Other";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(emp);
        return acc;
      }, {});
      res.json({ byDepartment: groupedByDept });
    } catch (error) { handleError(res, error, "Load employees by department"); }
  });
}
