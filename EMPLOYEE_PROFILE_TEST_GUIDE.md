# EMPLOYEE PROFILE TESTING - COMPLETE WALKTHROUGH

## ✅ SYSTEMS READY

### Backend Status
- ✅ Express server running on http://localhost:5000
- ✅ Firebase Admin SDK configured
- ✅ Employee API endpoints available
- ✅ Test data populated in Firestore

### Frontend Status
- ✅ Vite dev server running on http://localhost:5173
- ✅ React application compiled
- ✅ Employee Profile service created
- ✅ EmployeeProfiles component refactored

---

## MANUAL TESTING GUIDE

### Setup Steps Before Testing

1. **Ensure Both Servers Are Running**
   ```bash
   # Terminal 1: Backend
   cd C:\G1\clinic\src\services\server
   node server.js
   # Should show: "Clinic backend listening on http://localhost:5000"

   # Terminal 2: Frontend
   cd C:\G1\clinic
   npm run dev
   # Should show: "VITE v8.2.0 ready in ... ms"
   ```

2. **Verify Test Data Exists**
   ```bash
   cd C:\G1\clinic\src\services\server
   node populateTestData.js
   # Should show: "✓ Test data population complete!"
   ```

3. **Access the Application**
   - Open browser: http://localhost:5173
   - Login with your Firebase credentials
   - Navigate to "Employee Profiles" or "Clinic Staff" section

---

## TEST CASES

### Test 1: View Employee List

**Objective**: Verify that employees are loaded from the database and displayed

**Steps**:
1. Navigate to Employee Profiles page
2. Wait for page to load (should see loading indicator briefly)
3. Check that employee table is populated

**Expected Result**:
- ✓ List shows employees: "Dr. Maria Santos", "Nurse Juan Dela Cruz", "Staff Angela Reyes"
- ✓ Each employee shows: Name, Employee ID, Role, Department, Email
- ✓ Result count shows "3 result(s)"
- ✓ No error messages displayed

**Debugging if Failed**:
```
1. Check browser console (F12 > Console tab)
   - Look for error messages about fetch/API calls
   - Should see: "GET /api/employees" in Network tab

2. Check backend logs
   - Should show: "GET /api/employees" request
   - Should NOT show: "401" or "403" errors

3. Verify Firestore
   - Go to Firebase Console
   - Check "employees" collection
   - Verify documents exist with correct fields
```

---

### Test 2: Search Employees

**Objective**: Verify search functionality filters employees correctly

**Steps**:
1. On Employee Profiles page, click in search box
2. Type "Maria"
3. Verify results update

**Expected Result**:
- ✓ Result count shows "1 result(s)"
- ✓ Only "Dr. Maria Santos" is displayed
- ✓ Results update in real-time as you type

**Alternative Searches to Test**:
- Type "Medical" → Should find all Medical department employees
- Type "Doctor" → Should find employees with Doctor role
- Type "EMP-" → Should show matching employee IDs
- Clear search → Should show all employees again

---

### Test 3: Filter by Department

**Objective**: Verify department filter works correctly

**Steps**:
1. On Employee Profiles page, find "Department" filter dropdown
2. Click dropdown
3. Select "Medical"

**Expected Result**:
- ✓ Filter dropdown shows selected value
- ✓ Only employees in Medical department are shown
- ✓ Result count updates accordingly
- ✓ Selecting "All Departments" shows all employees again

**Debugging if Failed**:
```
Check that departments are unique:
- Should only show departments that exist in database
- Departments are extracted from employee records
```

---

### Test 4: View Employee Details

**Objective**: Verify clicking an employee opens their profile details

**Steps**:
1. In employee list, click "View" button on any employee row
2. Profile modal should open

**Expected Result**:
- ✓ Modal opens showing employee details
- ✓ Shows: Full Name, Email, Phone, Role, Department, Hire Date
- ✓ Shows employee ID in badge
- ✓ Shows "Back to Employee Directory" button
- ✓ No data is pre-loaded incorrectly

**For "Dr. Maria Santos", verify**:
- ✓ Name: Dr. Maria Santos
- ✓ Email: maria.santos@example.com
- ✓ Phone: +63-9123456789
- ✓ Role: Doctor
- ✓ Department: Medical
- ✓ Hire Date: 2021-06-15

---

### Test 5: Edit Employee

**Objective**: Verify employee information can be edited and saved

**Steps**:
1. Click "View" on any employee
2. Profile modal opens
3. Change the email address (e.g., add ".updated" before @example.com)
4. Click "Save Changes"

**Expected Result**:
- ✓ "Save Changes" button shows "Saving..." while processing
- ✓ Success message appears: "Employee updated successfully"
- ✓ Modal closes automatically
- ✓ Employee in list shows updated email
- ✓ Refresh page - changes persist in database

**Debugging if Failed**:
```
1. Check for validation errors
   - Email must be valid (contain @)
   - All fields must be filled

2. Check browser console for API errors
   - Should see: "PUT /api/employees/{id}" in Network tab
   - Status should be "200 OK"

3. Check backend logs
   - Should see: "Update employee" message
   - Should NOT see errors

4. Check Firestore
   - Find the employee document
   - Verify "updatedAt" timestamp changed
   - Verify new values are present
```

---

### Test 6: Add New Employee

**Objective**: Verify new employees can be created

**Steps**:
1. Click "Add Employee" button
2. Form modal opens with empty fields
3. Fill in all fields:
   - Full Name: "Dr. New Hire"
   - Email: "newhire@example.com"
   - Phone: "+63-9123456789"
   - Role: "Physician"
   - Department: "Medical"
   - Hire Date: "2024-01-15"
4. Click "Add Employee"

**Expected Result**:
- ✓ Button shows "Adding..." while processing
- ✓ Success message appears: "Employee created successfully"
- ✓ Modal closes
- ✓ New employee appears at end of list
- ✓ Employee ID is auto-generated
- ✓ Refresh page - new employee still exists

**Test Validation**:
- Try submitting empty form
  - ✓ Should show: "Please complete all required fields"
- Try invalid email
  - ✓ Should show email validation error
- Try invalid phone
  - ✓ Should show phone validation error

---

### Test 7: Delete Employee

**Objective**: Verify employees can be deleted

**Steps**:
1. Click "View" on the employee just created
2. Profile modal opens
3. Click "Delete" button
4. Confirmation dialog appears
5. Confirm deletion

**Expected Result**:
- ✓ Confirmation asks: "Are you sure you want to delete [Name]?"
- ✓ "Delete" button shows "Deleting..." while processing
- ✓ Success message appears: "Employee deleted successfully"
- ✓ Modal closes
- ✓ Employee no longer appears in list
- ✓ Refresh page - employee is permanently deleted

**Debugging if Failed**:
```
1. Check that confirmation dialog appeared
   - Browser should show native confirm() dialog

2. Check backend logs
   - Should see: "DELETE /api/employees/{id}" request
   - Status should be "200 OK"

3. Check Firestore
   - Document should be gone from "employees" collection
```

---

### Test 8: Error Handling - API Failure

**Objective**: Verify error handling when API fails

**Steps**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Throttling" and select "Offline"
4. Try to load Employee Profiles page
5. Click "Add Employee" or edit an employee

**Expected Result**:
- ✓ Loading page shows error message
- ✓ Error message: "Could not reach the clinic service..."
- ✓ "Retry" button appears and is clickable
- ✓ When trying to save while offline, error appears

**Recovery**:
1. Go back to Network tab
2. Click Throttling → Select "No throttling"
3. Click "Retry" or refresh page
4. Page should load successfully

---

### Test 9: Error Handling - Invalid Token

**Objective**: Verify handling of expired authentication

**Steps**:
1. Open browser DevTools Console (F12 > Console)
2. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Try to navigate to Employee Profiles

**Expected Result**:
- ✓ Get redirected to login page
- ✓ Error message: "Please sign in again"
- ✓ After login, can access Employee Profiles again

---

### Test 10: Performance Check

**Objective**: Verify page performs well with current data

**Steps**:
1. Open Employee Profiles page
2. Open browser DevTools (F12)
3. Go to Performance tab
4. Record page load
5. Type in search box and filter

**Criteria**:
- ✓ Initial load < 3 seconds
- ✓ Search/filter updates instant (< 500ms)
- ✓ No significant lag when sorting or filtering
- ✓ No memory leaks in console warnings

---

## NETWORK REQUEST VALIDATION

### When Loading Employee List:
```
GET /api/employees
Status: 200 OK
Response Body:
{
  "employees": [
    {
      "id": "doc-id-1",
      "name": "Dr. Maria Santos",
      "email": "maria.santos@example.com",
      "phone": "+63-9123456789",
      "department": "Medical",
      "role": "Doctor",
      "hireDate": "2021-06-15",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### When Creating Employee:
```
POST /api/employees
Headers:
  Authorization: Bearer {idToken}
  Content-Type: application/json

Request Body:
{
  "name": "Dr. New Hire",
  "email": "newhire@example.com",
  "phone": "+63-9123456789",
  "department": "Medical",
  "role": "Physician",
  "hireDate": "2024-01-15"
}

Response Body:
{
  "employee": {
    "id": "newly-generated-id",
    "name": "Dr. New Hire",
    "email": "newhire@example.com",
    "phone": "+63-9123456789",
    "department": "Medical",
    "role": "Physician",
    "hireDate": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### When Updating Employee:
```
PUT /api/employees/doc-id-1
Headers:
  Authorization: Bearer {idToken}
  Content-Type: application/json

Request Body:
{
  "name": "Dr. Maria Santos Updated",
  "email": "updated@example.com",
  "phone": "+63-9987654321",
  "department": "Medical",
  "role": "Senior Doctor",
  "hireDate": "2021-06-15"
}

Response Body:
{
  "employee": {
    "id": "doc-id-1",
    "name": "Dr. Maria Santos Updated",
    "email": "updated@example.com",
    "phone": "+63-9987654321",
    "department": "Medical",
    "role": "Senior Doctor",
    "hireDate": "2021-06-15",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:45Z"
  }
}
```

### When Deleting Employee:
```
DELETE /api/employees/doc-id-1
Headers:
  Authorization: Bearer {idToken}

Response Body:
{
  "message": "Employee record deleted."
}
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: "Please sign in again" Error
**Solution**:
1. Refresh page
2. If persists, logout and login again
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Empty Employee List
**Solution**:
1. Ensure test data was populated
   ```bash
   cd src/services/server
   node populateTestData.js
   ```
2. Check Firestore console - `employees` collection should exist
3. Check browser Network tab for API errors

### Issue: Search/Filter Not Working
**Solution**:
1. Ensure employees are loaded (check table has data first)
2. Type in lowercase (search is case-insensitive)
3. Check that search term matches employee data
4. Try refreshing page

### Issue: Save Button Doesn't Work
**Solution**:
1. Check all required fields are filled (marked with *)
2. Check email is valid (must contain @)
3. Check phone number is at least 10 digits
4. Check browser console for error messages
5. Check Network tab for API response status

### Issue: Changes Didn't Persist After Refresh
**Solution**:
1. Check backend is still running
2. Check Firebase console - changes should be in `employees` collection
3. Check browser Network tab - PUT request should have 200 status
4. Refresh page and check if data reloads

---

## SUCCESS CHECKLIST

- ✅ Employee list loads and displays data from database
- ✅ Search functionality filters employees in real-time
- ✅ Department filter works correctly
- ✅ View employee details shows complete information
- ✅ Can edit employee and save changes to database
- ✅ Changes persist after page refresh
- ✅ Can add new employee to database
- ✅ New employee ID is auto-generated
- ✅ Can delete employee from database
- ✅ Error messages display clearly
- ✅ Loading indicators appear during operations
- ✅ All API requests include authentication token
- ✅ Page handles network errors gracefully
- ✅ Validation prevents invalid data submission
- ✅ Success messages confirm operations completed

---

## FINAL VERIFICATION

Run this checklist to confirm everything works:

```
[ ] Both servers running (backend on 5000, frontend on 5173)
[ ] Can load Employee Profiles page
[ ] Employee list displays test data
[ ] Search works
[ ] Filter works
[ ] Can view employee details
[ ] Can edit and save employee
[ ] Changes appear in list after save
[ ] Changes persist after refresh
[ ] Can add new employee
[ ] New employee appears in list
[ ] Can delete employee
[ ] Deleted employee removed from list
[ ] Error messages appear when expected
[ ] No JavaScript errors in console
[ ] All network requests have 200 status (except 503 for health check with SMTP warning)
```

If all boxes checked: ✅ **Employee Profile Feature is Fully Operational!**

---

## NEXT STEPS

1. Deploy to staging environment
2. Test with more employees (100+)
3. Test with different user roles
4. Add role-based access control
5. Add employee photo upload
6. Add bulk import feature
7. Add export to PDF/Excel
8. Add audit logging
9. Add performance monitoring

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Status**: Ready for testing
