# Employee Profile API Documentation

## Overview
The Employee Profile API provides endpoints to manage employee records in the clinic management system. All endpoints require authentication (signed-in user).

## Base URL
```
/api/employees
```

## Authentication
All endpoints require the user to be signed in. Authentication is handled via Firebase Auth.

## Data Structure

### Employee Object
```json
{
  "id": "emp-001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "department": "Medical",
  "role": "Doctor",
  "hireDate": "2024-01-15",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Field Requirements
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | string | ✓ | Min 2 characters, max 500 |
| email | string | ✓ | Valid email format |
| phone | string | ✓ | Valid phone format (min 10 digits) |
| department | string | ✓ | Max 500 characters |
| role | string | ✓ | Max 500 characters |
| hireDate | string | ✓ | Format: YYYY-MM-DD |

## Endpoints

### 1. Get All Employees
**Retrieve a list of all employees with optional filtering.**

```
GET /api/employees
```

**Query Parameters:**
- `department` (optional): Filter by department
- `role` (optional): Filter by role

**Example Requests:**
```bash
# Get all employees
curl -X GET http://localhost:5000/api/employees

# Filter by department
curl -X GET "http://localhost:5000/api/employees?department=Medical"

# Filter by role
curl -X GET "http://localhost:5000/api/employees?role=Doctor"

# Filter by both
curl -X GET "http://localhost:5000/api/employees?department=Medical&role=Doctor"
```

**Response (200 OK):**
```json
{
  "employees": [
    {
      "id": "emp-001",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-123-4567",
      "department": "Medical",
      "role": "Doctor",
      "hireDate": "2024-01-15",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 2. Get Single Employee
**Retrieve a specific employee by ID.**

```
GET /api/employees/:id
```

**Parameters:**
- `id` (path, required): Employee ID

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/employees/emp-001
```

**Response (200 OK):**
```json
{
  "employee": {
    "id": "emp-001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "department": "Medical",
    "role": "Doctor",
    "hireDate": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Employee not found."
}
```

---

### 3. Create Employee
**Create a new employee profile.**

```
POST /api/employees
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-987-6543",
  "department": "Nursing",
  "role": "Nurse",
  "hireDate": "2024-02-01"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-987-6543",
    "department": "Nursing",
    "role": "Nurse",
    "hireDate": "2024-02-01"
  }'
```

**Response (200 OK):**
```json
{
  "employee": {
    "id": "emp-002",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-987-6543",
    "department": "Nursing",
    "role": "Nurse",
    "hireDate": "2024-02-01"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Enter a valid email address."
}
```

---

### 4. Update Employee
**Update an existing employee profile.**

```
PUT /api/employees/:id
```

**Parameters:**
- `id` (path, required): Employee ID

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone": "+1-555-987-6543",
  "department": "Nursing",
  "role": "Senior Nurse",
  "hireDate": "2024-02-01"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:5000/api/employees/emp-002 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "phone": "+1-555-987-6543",
    "department": "Nursing",
    "role": "Senior Nurse",
    "hireDate": "2024-02-01"
  }'
```

**Response (200 OK):**
```json
{
  "employee": {
    "id": "emp-002",
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "phone": "+1-555-987-6543",
    "department": "Nursing",
    "role": "Senior Nurse",
    "hireDate": "2024-02-01"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Employee not found."
}
```

---

### 5. Delete Employee
**Delete an employee record.**

```
DELETE /api/employees/:id
```

**Parameters:**
- `id` (path, required): Employee ID

**Example Request:**
```bash
curl -X DELETE http://localhost:5000/api/employees/emp-002
```

**Response (200 OK):**
```json
{
  "message": "Employee record deleted."
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Employee not found."
}
```

---

### 6. Get Employees Grouped by Department
**Retrieve all employees grouped by their department.**

```
GET /api/employees-by-department
```

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/employees-by-department
```

**Response (200 OK):**
```json
{
  "byDepartment": {
    "Medical": [
      {
        "id": "emp-001",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-123-4567",
        "department": "Medical",
        "role": "Doctor",
        "hireDate": "2024-01-15",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "Nursing": [
      {
        "id": "emp-002",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1-555-987-6543",
        "department": "Nursing",
        "role": "Nurse",
        "hireDate": "2024-02-01",
        "createdAt": "2024-02-01T12:00:00Z",
        "updatedAt": "2024-02-01T12:00:00Z"
      }
    ]
  }
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request** - Validation error:
```json
{
  "message": "Employee name is required and must be at least 2 characters."
}
```

**404 Not Found** - Employee doesn't exist:
```json
{
  "message": "Employee not found."
}
```

**500 Internal Server Error** - Server error:
```json
{
  "message": "Unable to create employee. Check the backend logs and try again."
}
```

---

## Validation Rules

### Name
- Required
- Minimum 2 characters
- Maximum 500 characters

### Email
- Required
- Must be a valid email format (e.g., user@domain.com)

### Phone
- Required
- Must contain at least 10 digits
- Can include spaces, hyphens, parentheses, and plus signs

### Department
- Required
- Maximum 500 characters

### Role
- Required
- Maximum 500 characters

### Hire Date
- Required
- Format: YYYY-MM-DD
- Must be a valid date

---

## Usage Examples

### JavaScript/Fetch

**Create Employee:**
```javascript
const employee = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1-555-123-4567",
  department: "Medical",
  role: "Doctor",
  hireDate: "2024-01-15"
};

fetch('/api/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(employee)
})
  .then(res => res.json())
  .then(data => console.log('Created:', data.employee));
```

**Get All Employees:**
```javascript
fetch('/api/employees')
  .then(res => res.json())
  .then(data => console.log('Employees:', data.employees));
```

**Update Employee:**
```javascript
const updated = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  phone: "+1-555-123-4567",
  department: "Medical",
  role: "Senior Doctor",
  hireDate: "2024-01-15"
};

fetch('/api/employees/emp-001', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updated)
})
  .then(res => res.json())
  .then(data => console.log('Updated:', data.employee));
```

**Delete Employee:**
```javascript
fetch('/api/employees/emp-001', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data.message));
```

---

## Database Schema

Employees are stored in Firestore under the `employees` collection:

```
employees/
├── emp-001/
│   ├── name: "John Doe"
│   ├── email: "john@example.com"
│   ├── phone: "+1-555-123-4567"
│   ├── department: "Medical"
│   ├── role: "Doctor"
│   ├── hireDate: "2024-01-15"
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
├── emp-002/
│   └── ...
```

---

## Notes

- All timestamps are in ISO 8601 format and managed server-side
- Employee IDs are auto-generated by Firestore
- All endpoints require user authentication
- Phone numbers are validated but stored as-is (trimmed and validated for format)
- Filtering by multiple fields is supported (e.g., department AND role)
