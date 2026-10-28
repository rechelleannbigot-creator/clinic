# Clinic Management System — patient account backend

The Add Patient screen uses the Express backend to create a Firebase Authentication account, save the patient and student profiles in Firestore, and email the patient's temporary password.

## Configure the backend

1. In Firebase Console, enable **Authentication → Email/Password** and create Firestore.
2. Create a Firebase Admin service-account key and save it as `src/services/server/serviceAccountKey.json`. This file is ignored by Git; never commit or expose it.
3. Copy `src/services/server/.env.example` to `src/services/server/.env`, then set the correct Firebase storage bucket and SMTP values. A legacy `src/services/server/env` file is also read if `.env` does not exist.
4. For Gmail, use a Google App Password in `SMTP_PASS`. Do not use your regular Gmail password.
5. Ensure the signed-in staff/admin has a `users/{uid}` Firestore document with a role of `staff`, `clinicstaff`, `admin`, or `administrator`.

The backend resolves a relative `GOOGLE_APPLICATION_CREDENTIALS` path relative to `src/services/server`, regardless of the terminal's current directory.

## Run locally

Open two terminals from the project root:

```bash
npm run dev
```

```bash
npm run server:dev
```

Check `http://localhost:5000/api/health`. A configured backend returns HTTP 200; HTTP 503 returns a `setupIssues` list explaining which Firebase Admin or SMTP settings are missing. The backend must be running and configured for patient records to load or be created. If it runs at a different URL, set `VITE_CLINIC_API_URL` in the frontend environment.

## Patient account data

- Firebase Authentication account using the patient's Gmail address and a random temporary password.
- Firestore `patients/P-###` record containing the patient's information and student role.
- Firestore `users/{uid}` profile used by the app's role-based login.
- Email with the patient ID and temporary password.

The temporary password is not saved in Firestore or returned to the browser. The `mustChangePassword` marker is saved, but the app still needs an enforced first-login password-change flow.
