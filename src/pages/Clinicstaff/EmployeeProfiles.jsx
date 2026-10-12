
import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  Eye,
  ArrowLeft,
  Save,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Building2,
  CalendarDays,
  IdCard,
  Filter,
} from "lucide-react";

import "../../styles/EmployeeProfiles.css";

const initialEmployees = [
  {
    id: "EMP-001",
    firstName: "Maria",
    middleName: "Cruz",
    lastName: "Santos",
    personnelType: "Teaching",
    position: "College Instructor",
    department: "College Department",
    employmentType: "Full-Time",
    dateHired: "2021-06-15",
    dateOfBirth: "1990-04-12",
    sex: "Female",
    email: "maria.santos@example.com",
    contact: "09123456789",
    address: "Isabela, Philippines",
    education: "Master of Arts in Education",
    specialization: "Education",
    status: "Active",
  },
  {
    id: "EMP-002",
    firstName: "Juan",
    middleName: "Reyes",
    lastName: "Dela Cruz",
    personnelType: "Teaching",
    position: "High School Teacher",
    department: "Junior High School",
    employmentType: "Full-Time",
    dateHired: "2022-06-01",
    dateOfBirth: "1988-09-20",
    sex: "Male",
    email: "juan.delacruz@example.com",
    contact: "09123456780",
    address: "Isabela, Philippines",
    education: "Bachelor of Secondary Education",
    specialization: "Mathematics",
    status: "Active",
  },
  {
    id: "EMP-003",
    firstName: "Angela",
    middleName: "Lopez",
    lastName: "Reyes",
    personnelType: "Non-Teaching",
    position: "Registrar Personnel",
    department: "Registrar's Office",
    employmentType: "Full-Time",
    dateHired: "2020-08-10",
    dateOfBirth: "1992-02-08",
    sex: "Female",
    email: "angela.reyes@example.com",
    contact: "09123456781",
    address: "Isabela, Philippines",
    education: "Bachelor of Science in Office Administration",
    specialization: "Records Management",
    status: "Active",
  },
  {
    id: "EMP-004",
    firstName: "Robert",
    middleName: "Garcia",
    lastName: "Mendoza",
    personnelType: "Non-Teaching",
    position: "IT Support Personnel",
    department: "Information Technology",
    employmentType: "Full-Time",
    dateHired: "2023-01-05",
    dateOfBirth: "1995-07-17",
    sex: "Male",
    email: "robert.mendoza@example.com",
    contact: "09123456782",
    address: "Isabela, Philippines",
    education: "Bachelor of Science in Information Technology",
    specialization: "Technical Support",
    status: "Active",
  },
];

const emptyEmployee = {
  id: "",
  firstName: "",
  middleName: "",
  lastName: "",
  personnelType: "Teaching",
  position: "",
  department: "",
  employmentType: "Full-Time",
  dateHired: "",
  dateOfBirth: "",
  sex: "",
  email: "",
  contact: "",
  address: "",
  education: "",
  specialization: "",
  status: "Active",
};

function EmployeeProfiles() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState(emptyEmployee);
  const [isAdding, setIsAdding] = useState(false);

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return employees.filter((employee) => {
      const fullName = [
        employee.firstName,
        employee.middleName,
        employee.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = [
        fullName,
        employee.id,
        employee.position,
        employee.department,
        employee.personnelType,
      ].some((value) => value?.toLowerCase().includes(term));

      const matchesType =
        typeFilter === "All" || employee.personnelType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [employees, searchTerm, typeFilter]);

  const teachingCount = employees.filter(
    (employee) => employee.personnelType === "Teaching"
  ).length;

  const nonTeachingCount = employees.filter(
    (employee) => employee.personnelType === "Non-Teaching"
  ).length;

  const getFullName = (employee) =>
    [
      employee.firstName,
      employee.middleName,
      employee.lastName,
    ]
      .filter(Boolean)
      .join(" ");

  const openProfile = (employee) => {
    setSelectedEmployee(employee);
    setFormData({ ...employee });
    setIsAdding(false);
  };

  const openAddForm = () => {
    setSelectedEmployee(null);
    setFormData({ ...emptyEmployee });
    setIsAdding(true);
  };

  const goBack = () => {
    setSelectedEmployee(null);
    setIsAdding(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.position.trim() ||
      !formData.department.trim()
    ) {
      window.alert(
        "Please complete the first name, last name, position, and department."
      );
      return;
    }

    if (isAdding) {
      const nextNumber =
        employees.reduce((max, employee) => {
          const number = Number(employee.id.replace("EMP-", ""));
          return Math.max(max, Number.isFinite(number) ? number : 0);
        }, 0) + 1;

      const newEmployee = {
        ...formData,
        id: `EMP-${String(nextNumber).padStart(3, "0")}`,
      };

      setEmployees((previous) => [...previous, newEmployee]);
      setSelectedEmployee(newEmployee);
      setFormData(newEmployee);
      setIsAdding(false);
    } else {
      const updatedEmployee = { ...formData };

      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === selectedEmployee.id
            ? updatedEmployee
            : employee
        )
      );

      setSelectedEmployee(updatedEmployee);
      window.alert("Employee profile updated successfully.");
    }
  };

  if (selectedEmployee || isAdding) {
    const editingExisting = Boolean(selectedEmployee);

    return (
      <div className="employee-profiles-page">
        <div className="employee-profile-page-header">
          <button
            type="button"
            className="employee-back-button"
            onClick={goBack}
          >
            <ArrowLeft size={18} />
            Back to Employee Directory
          </button>

          <div>
            <h1>
              {isAdding ? "Add Employee" : "Employee Profile"}
            </h1>
            <p>
              La Consolacion College of Isabela — Teaching and
              Non-Teaching Personnel
            </p>
          </div>
        </div>

        <div className="employee-profile-banner">
          <div className="employee-avatar large">
            <UserRound size={38} />
          </div>

          <div className="employee-banner-details">
            <h2>
              {editingExisting
                ? getFullName(selectedEmployee)
                : "New Employee"}
            </h2>
            <p>
              {editingExisting
                ? selectedEmployee.position
                : "Enter the employee's information below"}
            </p>
            {editingExisting && (
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
                <h3>Personal Information</h3>
                <p>Basic information about the employee</p>
              </div>
            </div>

            <div className="employee-form-grid">
              <FormField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <FormField label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
              <FormField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />

              <FormField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />

              <FormField label="Sex" name="sex" value={formData.sex} onChange={handleChange} options={["Male", "Female", "Prefer not to say"]} />

              <FormField label="Home Address" name="address" value={formData.address} onChange={handleChange} />
            </div>
          </section>

          <section className="employee-information-card">
            <div className="employee-section-heading">
              <span className="employee-section-number">II</span>
              <div>
                <h3>Employment Information</h3>
                <p>School assignment and employment details</p>
              </div>
            </div>

            <div className="employee-form-grid">
              <FormField label="Personnel Type" name="personnelType" value={formData.personnelType} onChange={handleChange} options={["Teaching", "Non-Teaching"]} required />

              <FormField label="Position / Job Title" name="position" value={formData.position} onChange={handleChange} required />

              <FormField label="Department / Office" name="department" value={formData.department} onChange={handleChange} required />

              <FormField label="Employment Type" name="employmentType" value={formData.employmentType} onChange={handleChange} options={["Full-Time", "Part-Time", "Contractual", "Probationary"]} />

              <FormField label="Date Hired" name="dateHired" type="date" value={formData.dateHired} onChange={handleChange} />

              <FormField label="Employment Status" name="status" value={formData.status} onChange={handleChange} options={["Active", "Inactive", "On Leave"]} />
            </div>
          </section>

          <section className="employee-information-card">
            <div className="employee-section-heading">
              <span className="employee-section-number">III</span>
              <div>
                <h3>Contact Information</h3>
                <p>Contact details for official communication</p>
              </div>
            </div>

            <div className="employee-form-grid">
              <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />

              <FormField label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} />

              <FormField label="Educational Attainment" name="education" value={formData.education} onChange={handleChange} />

              <FormField
                label={
                  formData.personnelType === "Teaching"
                    ? "Subject / Teaching Specialization"
                    : "Area of Expertise"
                }
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>
          </section>

          <div className="employee-form-actions">
            <button
              type="button"
              className="employee-cancel-button"
              onClick={goBack}
            >
              Cancel
            </button>

            <button type="submit" className="employee-save-button">
              <Save size={17} />
              {isAdding ? "Add Employee" : "Save Changes"}
            </button>
          </div>
        </form>
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
          <h1>Employee Profiles</h1>
          <p>
            Manage the profiles of all teaching and non-teaching
            personnel of La Consolacion College of Isabela.
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
          label="Total Personnel"
          value={employees.length}
        />
        <SummaryCard
          icon={<GraduationCap size={23} />}
          label="Teaching Personnel"
          value={teachingCount}
        />
        <SummaryCard
          icon={<Building2 size={23} />}
          label="Non-Teaching Personnel"
          value={nonTeachingCount}
        />
      </div>

      <div className="employee-directory-card">
        <div className="employee-directory-card-heading">
          <div>
            <h2>Personnel Directory</h2>
            <p>Search and view employee information</p>
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
              placeholder="Search name, ID, position, or department..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="employee-filter-box">
            <Filter size={17} />
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter personnel type"
            >
              <option value="All">All Personnel</option>
              <option value="Teaching">Teaching</option>
              <option value="Non-Teaching">Non-Teaching</option>
            </select>
          </div>
        </div>

        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Personnel Type</th>
                <th>Department</th>
                <th>Status</th>
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
                        <span>{employee.position}</span>
                      </div>
                    </div>
                  </td>

                  <td>{employee.id}</td>

                  <td>
                    <span
                      className={`employee-type-badge ${
                        employee.personnelType === "Teaching"
                          ? "teaching"
                          : "non-teaching"
                      }`}
                    >
                      {employee.personnelType}
                    </span>
                  </td>

                  <td>{employee.department}</td>

                  <td>
                    <span
                      className={`employee-status-badge ${employee.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {employee.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="employee-view-button"
                      onClick={() => openProfile(employee)}
                    >
                      <Eye size={16} />
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="6" className="employee-empty-state">
                    <Users size={32} />
                    <strong>No personnel found</strong>
                    <span>
                      Try another search term or personnel category.
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