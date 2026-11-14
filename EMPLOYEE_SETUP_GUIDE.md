# Employee Profile Backend - Setup & Usage Guide

## ✅ Implementation Complete

Your Employee Profile backend is now fully integrated and ready to use. Here's everything you need to know.

---

## 📦 What Was Delivered

### Backend Files Created

1. **[employeeRoutes.js](./src/services/server/employeeRoutes.js)** (126 lines)
   - Complete employee CRUD operations
   - Input validation
   - Error handling
   - Firestore integration

2. **[server.js](./src/services/server/server.js)** (MODIFIED)
   - Imported employeeRoutes
   - Registered all employee API endpoints

3. **[employeeRoutes.test.js](./src/services/server/employeeRoutes.test.js)** (220+ lines)
   - Comprehensive unit tests
   - Validation tests for all fields
   - Error scenario tests

4. **[EMPLOYEE_API.md](./EMPLOYEE_API.md)** (Complete API Reference)
   - All 6 endpoints documented
   - Request/response examples
   - Curl command examples
   - JavaScript/Fetch code samples
   - Validation rules reference

---

## 🚀 Getting Started

### 1. Start Your Backend Server

```bash
# From project root
npm run server:dev

# Output should show:
# Clinic backend listening on http://localhost:5000
```

### 2. Test an Endpoint

Use curl or any HTTP client:

```bash
# Get all employees
curl http://localhost:5000/api/employees

# Should return empty array initially:
# {"employees":[]}
```

---

## 📝 API Quick Reference

### Available Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/employees` | List all employees (with filters) |
| GET | `/api/employees/:id` | Get specific employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees-by-department` | List employees grouped by department |

---

## 💾 Employee Data Model

### Required Fields
```javascript
{
  name: "Dr. Jane Smith",           // String, 2-500 chars
  email: "jane@clinic.com",         // Valid email format
  phone: "+1-555-123-4567",         // Phone with 10+ digits
  department: "Medical",            // String, max 500 chars
  role: "Senior Doctor",            // String, max 500 chars
  hireDate: "2024-01-15"            // Date format: YYYY-MM-DD
}
```

### Auto-Generated Fields
```javascript
{
  id: "auto-generated-id",          // Firestore auto ID
  createdAt: "2024-01-15T10:30Z",   // Server timestamp
  updatedAt: "2024-01-15T10:30Z"    // Server timestamp
}
```

---

## 🔄 Common Operations

### Create Employee

**Request:**
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "john@clinic.com",
    "phone": "+1-555-123-4567",
    "department": "Medical",
    "role": "Doctor",
    "hireDate": "2024-01-15"
  }'
```

**Response:**
```json
{
  "employee": {
    "id": "emp-abc123",
    "name": "Dr. John Smith",
    "email": "john@clinic.com",
    "phone": "+1-555-123-4567",
    "department": "Medical",
    "role": "Doctor",
    "hireDate": "2024-01-15"
  }
}
```

### Get All Employees

**Request:**
```bash
curl http://localhost:5000/api/employees
```

**Response:**
```json
{
  "employees": [
    { "id": "emp-001", "name": "Dr. John Smith", ... },
    { "id": "emp-002", "name": "Nurse Jane Doe", ... }
  ]
}
```

### Filter by Department

**Request:**
```bash
curl "http://localhost:5000/api/employees?department=Medical"
```

### Filter by Role

**Request:**
```bash
curl "http://localhost:5000/api/employees?role=Doctor"
```

### Filter by Department AND Role

**Request:**
```bash
curl "http://localhost:5000/api/employees?department=Medical&role=Doctor"
```

### Get Single Employee

**Request:**
```bash
curl http://localhost:5000/api/employees/emp-001
```

### Update Employee

**Request:**
```bash
curl -X PUT http://localhost:5000/api/employees/emp-001 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "john.smith@clinic.com",
    "phone": "+1-555-123-4567",
    "department": "Medical",
    "role": "Senior Doctor",
    "hireDate": "2024-01-15"
  }'
```

### Delete Employee

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/employees/emp-001
```

### Get Employees by Department

**Request:**
```bash
curl http://localhost:5000/api/employees-by-department
```

**Response:**
```json
{
  "byDepartment": {
    "Medical": [
      { "id": "emp-001", "name": "Dr. John Smith", "department": "Medical", ... }
    ],
    "Nursing": [
      { "id": "emp-002", "name": "Nurse Jane Doe", "department": "Nursing", ... }
    ]
  }
}
```

---

## 🛡️ Validation & Error Handling

### Name Validation
- ✓ Required field
- ✓ Minimum 2 characters
- ✗ Empty string: `"Employee name is required and must be at least 2 characters."`

### Email Validation
- ✓ Required field
- ✓ Valid email format (e.g., user@domain.com)
- ✗ Invalid: `"Enter a valid email address."`

### Phone Validation
- ✓ Required field
- ✓ Minimum 10 digits
- ✓ Accepts: `+`, `-`, `()`, spaces
- ✗ Too short: `"Enter a valid phone number."`

### Department & Role Validation
- ✓ Required fields
- ✓ Maximum 500 characters each
- ✗ Empty: `"Department is required."` or `"Role is required."`

### Hire Date Validation
- ✓ Required field
- ✓ Format: `YYYY-MM-DD`
- ✓ Must be a valid date
- ✗ Invalid format: `"Enter a valid hire date (YYYY-MM-DD)."`
- ✗ Invalid date like `2024-02-30`: `"Enter a valid hire date (YYYY-MM-DD)."`

### Field Length Validation
- ✓ All text fields max 500 characters
- ✗ Exceeds: `"An employee field exceeds the maximum length."`

---

## 💻 Frontend Integration Examples

### React Hook for Employee List

```javascript
import { useState, useEffect } from 'react';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data.employees);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Employees</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
```

### React Hook for Creating Employee

```javascript
import { useState } from 'react';

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    hireDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        hireDate: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Employee</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Employee added successfully!</div>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="hireDate"
        value={formData.hireDate}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Employee'}
      </button>
    </form>
  );
}

export default AddEmployee;
```

---

## 🧪 Testing

### Run Tests
```bash
cd src/services/server
npm test -- employeeRoutes.test.js
```

### Test Coverage
- ✓ Valid employee creation
- ✓ Input trimming
- ✓ Name validation
- ✓ Email validation
- ✓ Phone validation
- ✓ Department validation
- ✓ Role validation
- ✓ Hire date validation
- ✓ Field length limits
- ✓ Phone format variations
- ✓ Error handling

---

## 📊 Database Structure

### Firestore Collection: `employees`

```
employees/
├── {auto-id-1}/
│   ├── name: "Dr. John Smith"
│   ├── email: "john@clinic.com"
│   ├── phone: "+1-555-123-4567"
│   ├── department: "Medical"
│   ├── role: "Doctor"
│   ├── hireDate: "2024-01-15"
│   ├── createdAt: Timestamp(2024-01-15T10:30:00Z)
│   └── updatedAt: Timestamp(2024-01-15T10:30:00Z)
├── {auto-id-2}/
│   └── ...
```

---

## 🔐 Security Features

- ✅ **Authentication Required**: All endpoints require signed-in user
- ✅ **Input Validation**: All fields validated server-side
- ✅ **Data Sanitization**: Text fields trimmed automatically
- ✅ **Length Limits**: Fields max 500 characters
- ✅ **Safe Error Messages**: No sensitive data in error responses
- ✅ **Type Checking**: All inputs validated for correct type
- ✅ **Firestore Security**: Leverages Firestore's built-in security

---

## 📚 Documentation Files

1. **[EMPLOYEE_API.md](./EMPLOYEE_API.md)**
   - Complete API reference
   - All endpoints documented
   - Request/response examples
   - Curl commands
   - JavaScript examples

2. **[EMPLOYEE_BACKEND_SUMMARY.md](./EMPLOYEE_BACKEND_SUMMARY.md)**
   - Implementation overview
   - Files created/modified
   - Quick start guide

3. **[EMPLOYEE_SETUP_GUIDE.md](./EMPLOYEE_SETUP_GUIDE.md)** (This file)
   - Setup instructions
   - Usage examples
   - Frontend integration code
   - Common operations

---

## 🆘 Troubleshooting

### "Employee not found" error
- Check the employee ID is correct
- Verify the employee exists in Firestore

### "Invalid email address" error
- Email must have format: `user@domain.com`
- Check for typos or spaces

### "Invalid hire date" error
- Date must be: `YYYY-MM-DD`
- Date must be a valid date (e.g., no Feb 30)

### "Enter a valid phone number"
- Phone must have at least 10 digits
- Try format: `+1-555-123-4567`

### Backend not running?
```bash
npm run server:dev
```

### Port already in use?
```bash
# Find process on port 5000
lsof -i :5000
# Kill it or change PORT env var
PORT=5001 npm run server:dev
```

---

## ✨ Next Steps

1. **Create Frontend Pages:**
   - Employee list page
   - Add employee form
   - Edit employee form
   - View employee details

2. **Add Advanced Features:**
   - Search by name
   - Sort by column
   - Pagination
   - Export to CSV
   - Bulk operations

3. **Integration:**
   - Link employees to consultations
   - Track employee schedules
   - Department management
   - Employee statistics dashboard

4. **Testing:**
   - Run the unit test suite
   - Test all CRUD operations
   - Test error scenarios
   - Load testing with multiple employees

---

## 📞 Support

For detailed API documentation: See [EMPLOYEE_API.md](./EMPLOYEE_API.md)

For implementation details: Check the inline comments in [employeeRoutes.js](./src/services/server/employeeRoutes.js)

For testing examples: Review [employeeRoutes.test.js](./src/services/server/employeeRoutes.test.js)

---

**Your Employee Profile backend is ready to go! 🚀**
