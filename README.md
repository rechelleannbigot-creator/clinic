# Clinic Management System — patient account backend

## 🆕 Employee Profile Management

The Employee Profile feature allows managing clinic staff and employees. **See [EMPLOYEE_PROFILE_FEATURES.md](./EMPLOYEE_PROFILE_FEATURES.md) for complete documentation.**

### Quick Start Employee Profile
```bash
npm run dev                    # Terminal 1: Frontend
npm run server:dev            # Terminal 2: Backend
# Then populate test data:
cd src/services/server && node populateTestData.js
```

Visit `http://localhost:5173` → Login → Navigate to Employee Profiles

**Documentation**:
- 📖 [Features & Quick Start](./EMPLOYEE_PROFILE_FEATURES.md)
- 🧪 [Testing Guide](./EMPLOYEE_PROFILE_TEST_GUIDE.md)
- 🐛 [Debugging Guide](./EMPLOYEE_PROFILE_DEBUG_GUIDE.md)
- 📋 [Technical Report](./EMPLOYEE_PROFILE_IMPLEMENTATION_REPORT.md)
- 🔌 [API Reference](./EMPLOYEE_API.md)

---

## Patient Management

The Add Patient screen uses the Express backend to create a Firebase Authentication account, save the patient and student profiles in Firestore, and email the patient a Firebase password-setup link.

## Configure Firebase

The frontend is configured for the Firebase project `clinic-management-system-c98ba` by default. To configure it through environment variables instead, copy `.env.example` to `.env` in the project root and set the Firebase web app values from Firebase Console → Project settings → Your apps.

In Firebase Console, enable **Authentication → Email/Password** and create the Firestore database. Patient account creation also requires a private Firebase Admin service-account key. Save it as `src/services/server/serviceAccountKey.json`; this path is ignored by Git. Never commit or share the key.

Copy `src/services/server/.env.example` to `src/services/server/.env`. The backend reads `.env` first and the legacy `env` file only when `.env` is absent. The example already targets this project's ID and storage bucket. Set `GOOGLE_APPLICATION_CREDENTIALS` to the service-account file path and configure SMTP values to email setup links. For Gmail, use a Google App Password in `SMTP_PASS`, not your regular password.

Ensure the signed-in staff/admin has a `users/{uid}` Firestore document with a role of `staff`, `clinicstaff`, `admin`, or `administrator`. The Firebase Admin SDK bypasses Firestore security rules; configure appropriate Firestore rules separately for any direct client access.

## Run locally

Open two terminals from the project root:

```bash
npm run dev
```

```bash
npm run server:dev
```

Check `http://localhost:5000/api/health`. HTTP 503 returns a `setupIssues` list explaining which service-account or SMTP settings need attention. Patient API requests also require valid Firebase Admin credentials and a working Firestore connection. If the backend runs at a different URL, set `VITE_CLINIC_API_URL` in the frontend environment.

## Patient account data

- Firebase Authentication account using the patient's Gmail address (random internal password, never emailed or stored).
- Firestore `patients/P-###` record containing the patient's information and student role.
- Firestore `users/{uid}` profile used by the app's role-based login.
- Email with the patient ID and a Firebase password-setup link (`LOGIN_URL` is the continue URL; add its domain, e.g. `localhost`, under Firebase Console → Authentication → Settings → Authorized domains).
- Patient edits update both Firestore profiles and the linked Firebase Authentication email/display name.

## Consultations and medicine inventory

The staff consultation form uses the same authenticated backend and `VITE_CLINIC_API_URL` as patient management. Start the backend as well as Vite. In production, set `VITE_CLINIC_API_URL` to the HTTPS backend address and `CLIENT_ORIGIN` to the exact frontend origin (scheme, host, and port); restart the backend and rebuild the frontend after changing configuration. Without `CLIENT_ORIGIN`, the backend accepts the default Vite origins on localhost and 127.0.0.1.

The staff and admin inventory pages now use the shared Firestore `medicines` collection; their old sample lists were never stored and are not migrated. Add real stock through an inventory page before issuing medicine. Consultation creation uses a Firestore transaction to verify the patient and stock, create the consultation, and deduct stock together. The server derives the staff identity from the authenticated user profile. Consultation dates use `YYYY-MM-DD`; creation times are UTC ISO timestamps.

The form keeps the same request ID when a save fails, so retrying the unchanged form cannot deduct stock twice. If a response is lost, retry the unchanged form before clearing it or leaving the page. A changed form cannot reuse an already committed request ID. Staff can view records in Visit History and the selected student's medical profile; students can view their own records in Visit History.

**Security deployment requirement:** The repository does not contain the deployed Firestore rules. Before using real medical data, review those rules in Firebase Console. Deny direct client access to `consultations` and `medicines` (the backend uses the Admin SDK) and ensure clients cannot grant themselves staff/admin roles or change another patient's identity link in `users` or `patients`. Preserve any access needed by other pages when updating the existing rules. Backend authorization relies on these protected role and identity fields; route guards and API checks alone cannot secure an overly permissive Firestore database.

Run the API route tests with `node --test src/services/server/clinicRoutes.test.js`. They use an isolated in-memory test database; verify the complete signed-in workflow separately with an explicitly designated test patient and stock in a safe Firebase environment.

## Medicine issuance

Staff and administrators can open Medicine Issuance from their dashboards. Search registered patients by name, student ID when available, or patient ID; the scanner accepts the existing patient-ID QR code. Patient registration currently does not collect a separate student ID, so missing IDs are shown as "Not provided". Camera scanning requires HTTPS or localhost.

Standalone issuances are stored in Firestore `medicineIssuances`; they use the existing `patients` and `medicines` records. A Firestore transaction checks stock and expiry and commits the issuance and stock deduction together. Repeating an unchanged request with the same request ID does not deduct stock again. If a response is uncertain, retry the same request before navigating away or reloading. The history also includes medicine issued through existing consultations; those older entries remain consultation records and disappear from this view if the consultation is deleted. Dates and daily totals use Philippine time.

The staff/admin-only API provides `GET /api/medicine-issuances`, `GET /api/medicine-issuances?patientId=...`, `GET /api/medicine-issuances/:id`, and `POST /api/medicine-issuances`. Patient search and stock use the existing `/api/patients` and `/api/medicines` endpoints. The server derives the issuing staff member from the authenticated profile. Before production use, also deny direct client access to `medicineIssuances` in the deployed Firestore rules, as for consultations and medicines, and verify the workflow with designated test records in a safe Firebase environment.

Run `node --test src/services/server/issuanceRoutes.test.js` for isolated API tests.

## Administrator reports

The admin Reports page reads current records through `GET /api/admin/reports`, protected by the backend administrator role check. It uses existing `patients`, `consultations`, `medicines`, `medicineIssuances`, and staff `users` records; no report collection or records are created. The page refreshes every minute while visible and when returning to the tab. Generate reloads the records and freezes the current filtered, sorted results for PDF, Excel, and print; changing filters or sorting requires generating again. Date ranges use Philippine calendar dates and exclude records with missing dates. Inventory date filters use the medicine creation date, not expiration.

Medicine-issued totals sum quantities, including medicine issued during consultations. Low stock includes zero stock and quantities at or below the recorded reorder level; medicines with invalid or missing stock/reorder data have unknown status and are excluded. The system has no dedicated transaction ledger: the transaction report is an activity view derived from patient registrations, consultations, and issuances. A consultation with medicine represents two different activity events. Events and legacy consultation issuances disappear if their underlying records are deleted; missing historical staff or dates are shown as unavailable. Staff status is checked against Firebase Authentication as well as the saved profile.

The deployed Firestore rules must protect these collections and role fields from direct unauthorized access as described above; backend authorization alone cannot compensate for permissive rules. Generated reports contain sensitive information and should only be downloaded or printed to approved locations. Run `node --test src/services/server/reportRoutes.test.js src/pages/Admin/reportModel.test.js src/pages/Admin/reportExport.test.js` for isolated report tests; verify the signed-in workflow with designated test records in a safe Firebase environment.

## Email failure recovery

If SMTP fails after the account is created, the account and records are kept (no duplicates) and `setupEmailSent: false` is saved. The UI shows a warning, and the patient details modal offers **Resend Setup Email** (`POST /api/patients/:patientId/resend-setup-email`), which sends a fresh link.

## Clinic staff My Profile

The staff profile uses the signed-in Firebase account and its `users/{uid}` Firestore document through the authenticated backend. Staff can edit personal details and upload a JPEG, PNG, or WebP profile picture up to 200 KB, stored in that document. Employee ID, employment details, role and login email are read-only; unavailable fields display as not provided. Password changes use Firebase Authentication and require the current password. Email/password sign-in must be enabled for password changes.

The backend must be running and deployed Firestore rules must protect user roles and identity fields as described above; ensure profile pictures and other personal fields are not publicly readable. Run profile API tests with `node --test src/services/server/staffProfileRoutes.test.js`.

## Staff dashboard

The staff dashboard uses the authenticated backend and the existing `patients`, `consultations`, and `medicines` collections. Its staff-only endpoints return summaries without consultation diagnoses or medical profile details. Dashboard dates and the 30-day expiry window use Philippine time. Available medicines count unexpired medicine records with positive stock; low stock includes out-of-stock records. Records with invalid stock or expiry data are marked Unknown and excluded from those totals. Medicine issuance counts consultations created today with a medicine; the medical-record total counts patient documents with a nonempty `medicalProfile`.

Notifications cover current stock/expiry alerts and the ten latest registration/consultation events. Read state is stored per staff account in `staffDashboardReads/{uid}/notifications`; it must not be directly accessible to clients under the deployed Firestore rules. Alerts reflect current stock rather than a historical notification log. The dashboard refreshes every minute while visible and when returning to the tab. QR scanning uses the existing patient record ID QR format and requires camera permission on HTTPS or localhost.

The existing system does not currently store consultation scheduling/status, medical-profile update audit events, or clinic announcements, so those cannot be shown as live data. The existing medical profile form does not persist edits; it now reports this instead of claiming a save succeeded. The existing staff reports page remains a demonstration, not a database report or working export. Patient creation does not currently collect a separate student ID, so the scanner shows it only when present in an existing record.

Run dashboard API tests with `node --test src/services/server/staffDashboardRoutes.test.js`. As with other clinical features, verify the authenticated workflow using designated test data and review deployed Firestore rules before production use.

## Verify each stage

```bash
npm run server:check
```

Separately checks the service-account file, Firebase Admin Auth, Firestore access, and SMTP login. Only PASS/FAIL and error codes are printed.

## Environment variables (`src/services/server/.env`)

`GOOGLE_APPLICATION_CREDENTIALS` (or Application Default Credentials), `FIREBASE_PROJECT_ID`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `LOGIN_URL`, `CLIENT_ORIGIN`, `PORT`. Frontend: `VITE_CLINIC_API_URL`.
