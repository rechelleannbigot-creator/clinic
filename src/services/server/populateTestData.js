import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.join(serverDirectory, "env");

dotenv.config({ path: envFile });

if (process.env.GOOGLE_APPLICATION_CREDENTIALS && !path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(serverDirectory, process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID || "clinic-management-system-c98ba",
});

const db = getFirestore();

const testEmployees = [
  {
    name: "Dr. Maria Santos",
    email: "maria.santos@example.com",
    phone: "+63-9123456789",
    department: "Medical",
    role: "Doctor",
    hireDate: "2021-06-15",
  },
  {
    name: "Nurse Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    phone: "+63-9123456780",
    department: "Nursing",
    role: "Nurse",
    hireDate: "2022-06-01",
  },
  {
    name: "Staff Angela Reyes",
    email: "angela.reyes@example.com",
    phone: "+63-9123456781",
    department: "Administration",
    role: "Administrative Staff",
    hireDate: "2020-08-10",
  },
];

async function populateTestData() {
  console.log("Populating test employee data...");

  try {
    for (const employee of testEmployees) {
      const docRef = db.collection("employees").doc();
      await docRef.set({
        ...employee,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✓ Created employee: ${employee.name}`);
    }

    console.log("\n✓ Test data population complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error populating test data:", error);
    process.exit(1);
  }
}

populateTestData();
