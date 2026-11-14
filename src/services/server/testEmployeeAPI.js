import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";

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

const auth = getAuth();
const db = getFirestore();
const API_URL = "http://localhost:5000";

async function testEmployeeAPI() {
  console.log("=== Employee Profile API Test ===\n");

  try {
    console.log("1. Creating test user and getting ID token...");
    
    const testEmail = `teststaff${Date.now()}@example.com`;
    const testPassword = "TempPassword123!";
    
    const userRecord = await auth.createUser({
      email: testEmail,
      password: testPassword,
      displayName: "Test Staff Member",
    });
    
    console.log(`   ✓ Test user created: ${userRecord.uid}`);

    console.log("\n2. Creating user profile in Firestore...");
    
    await db.collection("users").doc(userRecord.uid).set({
      email: testEmail,
      displayName: "Test Staff Member",
      role: "clinic_staff",
      createdAt: new Date(),
    });
    
    console.log("   ✓ User profile created in Firestore");

    console.log("\n3. Getting ID token for API authentication...");
    
    const idToken = await auth.createCustomToken(userRecord.uid);
    console.log("   ✓ Custom token generated");

    console.log("\n4. Testing GET /api/employees (without auth)...");
    
    try {
      const res = await fetch(`${API_URL}/api/employees`);
      const data = await res.json();
      console.log(`   Status: ${res.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      console.log(`   Error: ${err.message}`);
    }

    console.log("\n5. Testing GET /api/employees (with valid token)...");
    
    try {
      const res = await fetch(`${API_URL}/api/employees`, {
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(`   Status: ${res.status}`);
      if (data.employees) {
        console.log(`   ✓ Got ${data.employees.length} employees`);
        if (data.employees.length > 0) {
          console.log(`   Sample: ${JSON.stringify(data.employees[0], null, 2)}`);
        }
      } else {
        console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      console.log(`   Error: ${err.message}`);
    }

    console.log("\n6. Cleanup: Deleting test user...");
    
    await auth.deleteUser(userRecord.uid);
    await db.collection("users").doc(userRecord.uid).delete();
    
    console.log("   ✓ Test user deleted");

    console.log("\n=== Test Complete ===");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error during testing:", error.message);
    process.exit(1);
  }
}

testEmployeeAPI();
