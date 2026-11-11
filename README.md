# Clinic Management System — patient account backend

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

## Email failure recovery

If SMTP fails after the account is created, the account and records are kept (no duplicates) and `setupEmailSent: false` is saved. The UI shows a warning, and the patient details modal offers **Resend Setup Email** (`POST /api/patients/:patientId/resend-setup-email`), which sends a fresh link.

## Verify each stage

```bash
npm run server:check
```

Separately checks the service-account file, Firebase Admin Auth, Firestore access, and SMTP login. Only PASS/FAIL and error codes are printed.

## Environment variables (`src/services/server/.env`)

`GOOGLE_APPLICATION_CREDENTIALS` (or Application Default Credentials), `FIREBASE_PROJECT_ID`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `LOGIN_URL`, `CLIENT_ORIGIN`, `PORT`. Frontend: `VITE_CLINIC_API_URL`.
