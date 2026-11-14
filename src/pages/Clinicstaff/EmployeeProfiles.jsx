import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  Eye,
  ArrowLeft,
  Save,
  Trash2,
  AlertCircle,
  Loader,
  IdCard,
  Filter,
} from "lucide-react";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeProfileService";
import "../../styles/EmployeeProfiles.css";

const emptyEmployee = {
  id: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  role: "",
  hireDate: "",
};

function EmployeeProfiles() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState(emptyEmployee);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getEmployees();
      setEmployees(data);

      const uniqueDepts = [...new Set(data.map((emp) => emp.department).filter(Boolean))];
      setDepartments(uniqueDepts.sort());
    } catch (err) {
      console.error("Load employees error:", err);
      setError(err.message || "Failed to load employees. Please try again.");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return employees.filter((employee) => {
      const fullName = employee.name?.toLowerCase() || "";
      const dept = (employee.department || "").toLowerCase();
      const role = (employee.role || "").toLowerCase();

      const matchesSearch = term === "" || [
        fullName,
        employee.id,
        role,
        dept,
      ].some((value) => value?.includes(term));

      const matchesFilter =
        departmentFilter === "All" || employee.department === departmentFilter;

      return matchesSearch && matchesFilter;
    });
  }, [employees, searchTerm, departmentFilter]);

  const getFullName = (employee) => employee.name || "Unknown Employee";

  const openProfile = (employee) => {
    setSelectedEmployee(employee);
    setFormData({ ...employee });
    setIsAdding(false);
    setNotice(null);
  };

  const openAddForm = () => {
    setSelectedEmployee(null);
    setFormData({ ...emptyEmployee });
    setIsAdding(true);
    setNotice(null);
  };

  const goBack = () => {
    setSelectedEmployee(null);
    setIsAdding(false);
    setNotice(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.name.trim() || !formData.email || !formData.phone || !formData.department || !formData.role || !formData.hireDate) {
      setNotice({ type: "error", text: "Please complete all required fields." });
      return;
    }

    setIsSaving(true);
    setNotice(null);

    try {
      if (isAdding) {
        const newEmployee = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: formData.department.trim(),
          role: formData.role.trim(),
          hireDate: formData.hireDate,
        };

        const created = await createEmployee(newEmployee);
        setEmployees((previous) => [...previous, created]);
        
        const uniqueDepts = [...new Set([...departments, formData.department])];
        setDepartments(uniqueDepts.sort());
        
        setNotice({ type: "success", text: "Employee created successfully." });
        goBack();
      } else {
        const updated = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: formData.department.trim(),
          role: formData.role.trim(),
          hireDate: formData.hireDate,
        };

        const result = await updateEmployee(selectedEmployee.id, updated);
        setEmployees((previous) =>
          previous.map((emp) =>
            emp.id === selectedEmployee.id ? result : emp
          )
        );
        setSelectedEmployee(result);
        setNotice({ type: "success", text: "Employee updated successfully." });
      }
    } catch (err) {
      console.error("Save employee error:", err);
      setNotice({ type: "error", text: err.message || "Failed to save employee. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    if (!window.confirm(`Are you sure you want to delete ${getFullName(selectedEmployee)}?`)) {
      return;
    }

    setIsDeleting(true);
    setNotice(null);

    try {
      await deleteEmployee(selectedEmployee.id);
      setEmployees((previous) =>
        previous.filter((emp) => emp.id !== selectedEmployee.id)
      );
      setNotice({ type: "success", text: "Employee deleted successfully." });
      goBack();
    } catch (err) {
      console.error("Delete employee error:", err);
      setNotice({ type: "error", text: err.message || "Failed to delete employee. Please try again." });
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedEmployee || isAdding) {
    return (
      <div className="employee-profiles-page">
        <div className="employee-profile-page-header">
          <button
            type="button"
            className="employee-back-button"
            onClick={goBack}
            disabled={isSaving || isDeleting}
          >
            <ArrowLeft size={18} />
            Back to Employee Directory
          </button>

          <div>
            <h1>
              {isAdding ? "Add Employee" : "Employee Profile"}
            </h1>
            <p>
              La Consolacion College of Isabela — Employee Management
            </p>
          </div>
        </div>

        {notice && (
          <div style={{
            padding: "12px 16px",
            marginBottom: "16px",
            borderRadius: "6px",
            backgroundColor: notice.type === "error" ? "#fee2e2" : "#dcfce7",
            color: notice.type === "error" ? "#b91c1c" : "#166534",
            border: `1px solid ${notice.type === "error" ? "#fecaca" : "#bbf7d0"}`,
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}>
            <AlertCircle size={18} />
            {notice.text}
          </div>
        )}

        <div className="employee-profile-banner">
          <div className="employee-avatar large">
            <UserRound size={38} />
          </div>

          <div className="employee-banner-details">
            <h2>
              {isAdding ? "New Employee" : getFullName(selectedEmployee)}
            </h2>
            <p>
              {isAdding
                ? "Enter the employee's information below"
                : selectedEmployee.role}
            </p>
            {!isAdding && (
              <span className="employee-id-badge">
                <IdCard size={15} />
                {selectedEmployee.id}
              </span>
            )}
          </div>
        </div>

        <form className="employee-profile-form" onSubmit={handleSave}>
          <section className="employee-information-card">
            <div className="employee-section-heading">
              <span className="employee-section-number">I</span>
              <div>
                <h3>Employee Information</h3>
                <p>Basic information about the employee</p>
              </div>
            </div>

            <div className="employee-form-grid">
              <FormField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <FormField
                label="Contact Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <FormField
                label="Job Title / Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />

              <FormField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />

              <FormField
                label="Hire Date"
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          <div className="employee-form-actions">
            <button
              type="button"
              className="employee-cancel-button"
              onClick={goBack}
              disabled={isSaving || isDeleting}
            >
              Cancel
            </button>

            {!isAdding && (
              <button
                type="button"
                className="employee-delete-button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
              >
                <Trash2 size={17} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}

            <button
              type="submit"
              className="employee-save-button"
              disabled={isSaving || isDeleting}
            >
              <Save size={17} />
              {isSaving ? "Saving..." : isAdding ? "Add Employee" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="employee-profiles-page">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Loader size={32} style={{ animation: "spin 1s linear infinite", marginBottom: "16px" }} />
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-profiles-page">
        <div style={{
          padding: "16px",
          backgroundColor: "#fee2e2",
          color: "#b91c1c",
          borderRadius: "6px",
          border: "1px solid #fecaca",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}>
          <AlertCircle size={20} />
          <div>
            <strong>Error Loading Employees</strong>
            <p>{error}</p>
            <button
              type="button"
              onClick={loadEmployees}
              style={{
                marginTop: "8px",
                padding: "8px 16px",
                backgroundColor: "#b91c1c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-profiles-page">
      <div className="employee-directory-header">
        <div>
          <span className="employee-eyebrow">
            LCCI PERSONNEL MANAGEMENT
          </span>
          <h1>Employee Directory</h1>
          <p>
            Manage the profiles of all employees of La Consolacion College of Isabela.
          </p>
        </div>

        <button
          type="button"
          className="employee-add-button"
          onClick={openAddForm}
        >
          <Users size={18} />
          Add Employee
        </button>
      </div>

      <div className="employee-summary-grid">
        <SummaryCard
          icon={<Users size={23} />}
          label="Total Employees"
          value={employees.length}
        />
        <SummaryCard
          icon={<Users size={23} />}
          label="Departments"
          value={departments.length}
        />
      </div>

      <div className="employee-directory-card">
        <div className="employee-directory-card-heading">
          <div>
            <h2>Employee Directory</h2>
            <p>Search and manage employee information</p>
          </div>
          <span className="employee-result-count">
            {filteredEmployees.length} result(s)
          </span>
        </div>

        <div className="employee-search-toolbar">
          <div className="employee-search-box">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search name, ID, role, or department..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="employee-filter-box">
            <Filter size={17} />
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              aria-label="Filter by department"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="employee-table-person">
                      <div className="employee-avatar">
                        <UserRound size={21} />
                      </div>
                      <div>
                        <strong>{getFullName(employee)}</strong>
                        <span>{employee.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td>{employee.id}</td>
                  <td>{employee.role}</td>
                  <td>{employee.department}</td>
                  <td style={{ fontSize: "0.9em", color: "#666" }}>
                    {employee.email}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="employee-view-button"
                      onClick={() => openProfile(employee)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="6" className="employee-empty-state">
                    <Users size={32} />
                    <strong>No employees found</strong>
                    <span>
                      Try another search term or department filter.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  required = false,
}) {
  return (
    <div className="employee-form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="employee-required"> *</span>}
      </label>

      {options ? (
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="employee-summary-card">
      <div className="employee-summary-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default EmployeeProfiles;
