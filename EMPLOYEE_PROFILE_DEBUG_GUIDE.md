# Employee Profile Debugging & Testing Guide

## Summary of Changes

This document outlines all the fixes applied to make the Employee Profile functionality fully operational.

## Issues Fixed

### 1. **Hardcoded Dummy Data** ❌ → ✅
- **Problem**: `EmployeeProfiles.jsx` used hardcoded dummy employee data and never fetched from the backend
- **Solution**: Replaced with real API calls using new `employeeProfileService.js`

### 2. **Missing Employee Service** ❌ → ✅
- **Problem**: No service layer for making API calls to employee endpoints
- **Solution**: Created `src/services/employeeProfileService.js` with methods:
  - `getEmployees()` - Get all employees with optional filters
  - `getMyProfile()` - Get current logged-in employee's profile
  - `getEmployeeById()` - Get single employee
  - `createEmployee()` - Add new employee
  - `updateEmployee()` - Update employee info
  - `deleteEmployee()` - Remove employee
  - `getEmployeesByDepartment()` - Group by department

### 3. **Missing "Me" Endpoint** ❌ → ✅
- **Problem**: No way for employees to retrieve their own profile
- **Solution**: Added `/api/employees/me/profile` endpoint in `employeeRoutes.js`

### 4. **Frontend Component Not Using API** ❌ → ✅
- **Problem**: `EmployeeProfiles.jsx` had dummy UI but didn't connect to backend
- **Solution**: Completely refactored to:
  - Fetch employees on component load
  - Handle loading states
  - Show error messages
  - Support CRUD operations with real API
  - Display actual employee data from database

## Files Created

1. **`src/services/employeeProfileService.js`** (NEW)
   - Central service for all employee-related API calls
   - Proper error handling and validation
   - Uses `requestPatientApi()` for authenticated requests

2. **`src/services/server/populateTestData.js`** (NEW)
   - Helper script to populate test employee data
   - Used for initial testing and demonstration

3. **`src/services/server/testEmployeeAPI.js`** (NEW)
   - API endpoint testing script
   - Creates test user and verifies authentication flow

## Files Modified

1. **`src/pages/Clinicstaff/EmployeeProfiles.jsx`** (MAJOR CHANGES)
   - Removed hardcoded `initialEmployees` array
   - Added `useEffect` hook to load employees on mount
   - Integrated `employeeProfileService` calls
   - Added proper loading/error states
   - Implemented real CRUD operations
   - Added delete functionality
   - Improved validation and error handling

2. **`src/services/server/employeeRoutes.js`** (MINOR CHANGES)
   - Added `/api/employees/me/profile` endpoint
   - No changes to existing endpoints

## How It Works Now

### 1. Loading Employee List
```
User visits EmployeeProfiles page
  ↓
useEffect triggers loadEmployees()
  ↓
Calls getEmployees() from service
  ↓
Service makes authenticated API call to /api/employees
  ↓
Backend verifies Firebase ID token
  ↓
Firestore returns employee collection
  ↓
UI displays employees in table
```

### 2. Creating New Employee
```
User clicks "Add Employee"
  ↓
Form modal opens with empty fields
  ↓
User fills in: name, email, phone, department, role, hireDate
  ↓
User clicks "Add Employee" button
  ↓
handleSave() validates all required fields
  ↓
Calls createEmployee() from service
  ↓
Service makes authenticated POST to /api/employees
  ↓
Backend creates Firestore document with timestamps
  ↓
Response includes new employee with generated ID
  ↓
UI adds to list, shows success message
```

### 3. Editing Employee
```
User clicks "View" on employee row
  ↓
Profile modal opens with employee data pre-filled
  ↓
User modifies fields
  ↓
User clicks "Save Changes"
  ↓
handleSave() validates and calls updateEmployee()
  ↓
Service makes authenticated PUT to /api/employees/{id}
  ↓
Backend validates and updates Firestore document
  ↓
Response includes updated employee
  ↓
UI updates list item, shows success message
```

### 4. Deleting Employee
```
User clicks "View" on employee row
  ↓
Profile modal opens
  ↓
User clicks "Delete"
  ↓
Confirmation dialog appears
  ↓
User confirms deletion
  ↓
Calls deleteEmployee() from service
  ↓
Service makes authenticated DELETE to /api/employees/{id}
  ↓
Backend removes Firestore document
  ↓
Response confirms deletion
  ↓
UI removes from list, shows success message
```

### 5. Filtering & Searching
```
User types in search box or selects department filter
  ↓
filteredEmployees computed with useMemo
  ↓
Filters by: name, ID, role, department
  ↓
Table re-renders with filtered results
```

## Authentication & Authorization

### How Authentication Works
1. User logs in with Firebase Auth
2. Frontend receives Firebase ID token
3. Token is automatically included in all API requests via `Authorization: Bearer {token}` header
4. Backend verifies token with Firebase Admin SDK
5. If valid, proceeds with request; if invalid, returns 401

### Current Authorization
- Employees accessing their own profile: ✅ Works (any signed-in user)
- Clinic staff accessing employee directory: ✅ Works (any signed-in user)
- Only clinic staff can manage employees: ⚠️ Not yet implemented
  - TODO: Add `requireClinicStaff` middleware to protect POST/PUT/DELETE

## Testing Instructions

### Manual Testing (UI)

1. **Start Servers**
   ```bash
   npm run server:dev        # Terminal 1
   npm run dev               # Terminal 2
   ```

2. **Navigate to Employee Profiles**
   - Go to `http://localhost:5173`
   - Login with clinic staff account
   - Navigate to "Employee Profiles" section

3. **Test View Employees**
   - Should see list of employees loaded from database
   - Test search functionality
   - Test department filter

4. **Test Add Employee**
   - Click "Add Employee"
   - Fill in all required fields
   - Click "Add Employee"
   - Verify employee appears in list
   - Refresh page - data should persist

5. **Test Edit Employee**
   - Click "View" on an employee
   - Modify fields
   - Click "Save Changes"
   - Verify changes appear in list

6. **Test Delete Employee**
   - Click "View" on an employee
   - Click "Delete"
   - Confirm deletion
   - Verify employee removed from list

### API Testing

1. **Populate Test Data**
   ```bash
   cd src/services/server
   node populateTestData.js
   ```

2. **Test API Endpoints**
   ```bash
   # Get all employees (requires authentication)
   curl -X GET http://localhost:5000/api/employees \
     -H "Authorization: Bearer {idToken}"

   # Get employee by ID
   curl -X GET http://localhost:5000/api/employees/EMP-001 \
     -H "Authorization: Bearer {idToken}"

   # Create employee
   curl -X POST http://localhost:5000/api/employees \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {idToken}" \
     -d '{
       "name": "Dr. New Employee",
       "email": "new@example.com",
       "phone": "+63-9123456789",
       "department": "Medical",
       "role": "Doctor",
       "hireDate": "2024-01-15"
     }'

   # Update employee
   curl -X PUT http://localhost:5000/api/employees/EMP-001 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {idToken}" \
     -d '{
       "name": "Dr. Updated Name",
       "email": "updated@example.com",
       "phone": "+63-9987654321",
       "department": "Medical",
       "role": "Senior Doctor",
       "hireDate": "2021-06-15"
     }'

   # Delete employee
   curl -X DELETE http://localhost:5000/api/employees/EMP-001 \
     -H "Authorization: Bearer {idToken}"

   # Get my profile (current logged-in employee)
   curl -X GET http://localhost:5000/api/employees/me/profile \
     -H "Authorization: Bearer {idToken}"

   # Get employees by department
   curl -X GET http://localhost:5000/api/employees-by-department \
     -H "Authorization: Bearer {idToken}"
   ```

## Known Limitations & TODO

### Current Limitations
1. ⚠️ No role-based access control on employee endpoints
   - Currently any authenticated user can create/update/delete employees
   - **TODO**: Add `requireClinicStaff` middleware to POST/PUT/DELETE routes

2. ⚠️ No profile picture upload support
   - Current schema only supports: name, email, phone, department, role, hireDate
   - **TODO**: Add file upload for employee photos

3. ⚠️ No bulk operations
   - Cannot bulk import employees from CSV
   - **TODO**: Add bulk import feature

4. ⚠️ No audit logging
   - Changes to employee records are not logged
   - **TODO**: Add audit trail

### Improvements Made in This Session
✅ Fixed hardcoded dummy data
✅ Created employee profile service
✅ Implemented real API integration
✅ Added proper loading states
✅ Added comprehensive error handling
✅ Added create/update/delete operations
✅ Added search and filtering
✅ Added success/error notifications
✅ Added "me" endpoint for current user profile
✅ Proper form validation

## Data Model

Employee documents in Firestore have this structure:
```json
{
  "id": "generated-doc-id",
  "name": "Full Name",
  "email": "user@example.com",
  "phone": "+63-9123456789",
  "department": "Department Name",
  "role": "Job Title",
  "hireDate": "YYYY-MM-DD",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Error Handling

The service handles these error scenarios:
- ❌ Missing authentication token → "Please sign in again"
- ❌ Invalid/expired token → "Your session is invalid or expired"
- ❌ Network error → "Could not reach the clinic service"
- ❌ Invalid response → "Returned an invalid response"
- ❌ Validation errors → "Enter a valid {field}"
- ❌ Employee not found → "Employee not found"
- ❌ Database errors → "Unable to {operation}. Check the backend logs"

## Debugging

If you encounter issues:

1. **Check Backend Logs**
   ```bash
   # Terminal running `npm run server:dev`
   # Look for error messages
   ```

2. **Check Browser Console**
   ```javascript
   // Open DevTools → Console tab
   // Look for fetch errors, state updates, or exceptions
   ```

3. **Check Network Requests**
   ```javascript
   // Open DevTools → Network tab
   // Check API calls to /api/employees*
   // Verify Authorization header is present
   // Check response status and body
   ```

4. **Test Backend Directly**
   ```bash
   cd src/services/server
   node testEmployeeAPI.js
   ```

5. **Check Firestore**
   - Go to Firebase Console
   - Check `employees` collection exists
   - Verify documents have correct fields
   - Check `users` collection for authentication records

## Security Considerations

### Current Implementation
✅ Firebase ID token authentication on all endpoints
✅ Validation of all input fields
✅ Timestamp on all database operations
✅ CORS configured for development
✅ Request size limited to 1MB

### Missing Security
⚠️ No role-based access control (RBAC)
   - Should restrict creation/update/delete to clinic staff
   - Should restrict employee list viewing to authorized roles
   - Should allow employees to only view their own profile

⚠️ No data sanitization
   - HTML/JS injection not prevented
   - TODO: Add input sanitization

## Next Steps to Production

1. Add role-based access control
2. Add employee photo upload
3. Add audit logging
4. Add bulk import/export
5. Add employee history/changes tracking
6. Add export to PDF/Excel
7. Add email notifications for changes
8. Add employee performance metrics
9. Add department statistics/reports
10. Add scheduling features

---

**Last Updated**: 2024-01-15
**Status**: ✅ MVP Complete - Ready for testing
