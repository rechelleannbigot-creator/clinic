# Clinic Management System — patient account backend

The Add Patient screen uses the Express backend to create a Firebase Authentication account, save the patient and student profiles in Firestore, and email the patient's temporary password.

## Configure Firebase

The frontend is configured for the Firebase project `clinic-management-system-c98ba` by default. To configure it through environment variables instead, copy `.env.example` to `.env` in the project root and set the Firebase web app values from Firebase Console → Project settings → Your apps.

In Firebase Console, enable **Authentication → Email/Password** and create the Firestore database. Patient account creation also requires a private Firebase Admin service-account key. Save it as `src/services/server/serviceAccountKey.json`; this path is ignored by Git. Never commit or share the key.

Copy `src/services/server/.env.example` to `src/services/server/.env`. The backend reads `.env` first and the legacy `env` file only when `.env` is absent. The example already targets this project's ID and storage bucket. Set `GOOGLE_APPLICATION_CREDENTIALS` to the service-account file path and configure SMTP values to email temporary passwords. For Gmail, use a Google App Password in `SMTP_PASS`, not your regular password.

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

- Firebase Authentication account using the patient's Gmail address and a random temporary password.
- Firestore `patients/P-###` record containing the patient's information and student role.
- Firestore `users/{uid}` profile used by the app's role-based login.
- Email with the patient ID and temporary password.
- Patient edits update both Firestore profiles and the linked Firebase Authentication email/display name.

The temporary password is not saved in Firestore or returned to the browser. The `mustChangePassword` marker is saved, but the app still needs an enforced first-login password-change flow.
