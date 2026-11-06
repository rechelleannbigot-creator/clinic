import {
  auth,
  db,
  emailTransporter,
  getSetupIssues,
  credentialFileMissing,
} from "./config.js";

// Each stage runs independently so one failure does not hide the others.
// Only pass/fail and error codes are printed, never credentials.
const results = [];

async function check(name, run) {
  try {
    const detail = await run();
    results.push({ name, ok: true, detail });
  } catch (error) {
    results.push({ name, ok: false, detail: error.code || error.message });
  }
}

await check("Service-account file", async () => {
  if (credentialFileMissing()) throw new Error("File set in GOOGLE_APPLICATION_CREDENTIALS does not exist");
  return "present (or using Application Default Credentials)";
});

await check("Firebase Admin Authentication", async () => {
  await auth.listUsers(1);
  return "connected";
});

await check("Firestore read", async () => {
  await db.collection("systemCounters").limit(1).get();
  return "connected";
});

await check("SMTP connection and login", async () => {
  await emailTransporter().verify();
  return "SMTP server accepted the credentials";
});

console.log("\nBackend configuration check");
for (const { name, ok, detail } of results) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: ${detail}`);
}

const issues = getSetupIssues();
if (issues.length) {
  console.log("\nSetup issues:");
  issues.forEach((issue) => console.log(` - ${issue}`));
}

process.exit(results.every((result) => result.ok) ? 0 : 1);
