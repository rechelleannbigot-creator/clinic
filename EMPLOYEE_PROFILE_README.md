# 🏥 Employee Profile Backend

A complete, production-ready backend for managing employee profiles in your clinic management system.

## 📋 Quick Start

```bash
# 1. Start your server
npm run server:dev

# 2. Create an employee
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

# 3. Get all employees
curl http://localhost:5000/api/employees
```

## ✨ Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete employees
- ✅ **Advanced Filtering** - Filter by department and role
- ✅ **Full Validation** - Server-side validation for all fields
- ✅ **Error Handling** - Descriptive error messages
- ✅ **Authentication** - Requires signed-in user
- ✅ **Firestore Integration** - Persistent data storage
- ✅ **Grouping** - Get employees grouped by department
- ✅ **Auto Timestamps** - Automatic createdAt and updatedAt

## 🎯 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees (filterable) |
| GET | `/api/employees/:id` | Get a specific employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees-by-department` | Group employees by department |

## 📊 Employee Data Model

```javascript
{
  // Required fields
  name: string,              // 2-500 characters
  email: string,             // Valid email format
  phone: string,             // 10+ digit phone
  department: string,        // Max 500 characters
  role: string,              // Max 500 characters
  hireDate: string,          // Format: YYYY-MM-DD

  // Auto-generated
  id: string,                // Firestore auto ID
  createdAt: timestamp,      // Server timestamp
  updatedAt: timestamp       // Server timestamp
}
```

## 📁 Files

- **[employeeRoutes.js](./src/services/server/employeeRoutes.js)** - Backend implementation
- **[employeeRoutes.test.js](./src/services/server/employeeRoutes.test.js)** - Unit tests
- **[EMPLOYEE_API.md](./EMPLOYEE_API.md)** - Complete API reference
- **[EMPLOYEE_SETUP_GUIDE.md](./EMPLOYEE_SETUP_GUIDE.md)** - Setup & usage guide
- **[EMPLOYEE_BACKEND_SUMMARY.md](./EMPLOYEE_BACKEND_SUMMARY.md)** - Implementation summary

## 🚀 Examples

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "email": "jane@clinic.com",
    "phone": "+1-555-987-6543",
    "department": "Surgery",
    "role": "Surgeon",
    "hireDate": "2024-02-01"
  }'
```

### Get All Employees
```bash
curl http://localhost:5000/api/employees
```

### Filter by Department
```bash
curl "http://localhost:5000/api/employees?department=Medical"
```

### Get Single Employee
```bash
curl http://localhost:5000/api/employees/emp-001
```

### Update Employee
```bash
curl -X PUT http://localhost:5000/api/employees/emp-001 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "john@clinic.com",
    "phone": "+1-555-123-4567",
    "department": "Medical",
    "role": "Senior Doctor",
    "hireDate": "2024-01-15"
  }'
```

### Delete Employee
```bash
curl -X DELETE http://localhost:5000/api/employees/emp-001
```

## 💻 Frontend Integration (React)

```javascript
import { useState, useEffect } from 'react';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data.employees));
  }, []);

  return (
    <div>
      {employees.map(emp => (
        <div key={emp.id}>
          <h3>{emp.name}</h3>
          <p>Email: {emp.email}</p>
          <p>Role: {emp.role}</p>
          <p>Department: {emp.department}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🛡️ Validation

All fields are validated server-side:

| Field | Rules |
|-------|-------|
| name | Required, 2-500 chars |
| email | Required, valid email format |
| phone | Required, 10+ digits |
| department | Required, max 500 chars |
| role | Required, max 500 chars |
| hireDate | Required, YYYY-MM-DD format |

## 🧪 Testing

```bash
npm test -- employeeRoutes.test.js
```

## 📚 Documentation

- **API Reference**: See [EMPLOYEE_API.md](./EMPLOYEE_API.md) for complete endpoint documentation
- **Setup Guide**: See [EMPLOYEE_SETUP_GUIDE.md](./EMPLOYEE_SETUP_GUIDE.md) for detailed setup and usage
- **Implementation**: See [EMPLOYEE_BACKEND_SUMMARY.md](./EMPLOYEE_BACKEND_SUMMARY.md) for technical overview

## 🔐 Security

- ✅ All endpoints require authentication
- ✅ Input validation on all fields
- ✅ Safe error messages
- ✅ Field length limits
- ✅ Type checking
- ✅ Firestore security rules

## ✅ Status

- ✓ Backend implementation complete
- ✓ All endpoints working
- ✓ Full validation implemented
- ✓ Error handling in place
- ✓ Database schema defined
- ✓ Comprehensive documentation
- ✓ Unit tests included

## 🎓 Next Steps

1. **Create frontend UI** for employee management
2. **Add search functionality** to employee list
3. **Implement sorting** by different fields
4. **Create edit/delete forms** for employee management
5. **Add advanced features** like pagination, export, filtering

## 📖 For More Information

- Full API documentation: [EMPLOYEE_API.md](./EMPLOYEE_API.md)
- Setup and usage guide: [EMPLOYEE_SETUP_GUIDE.md](./EMPLOYEE_SETUP_GUIDE.md)
- Implementation summary: [EMPLOYEE_BACKEND_SUMMARY.md](./EMPLOYEE_BACKEND_SUMMARY.md)

---

**Ready to go!** Start your server with `npm run server:dev` and begin using the Employee Profile API. 🚀
