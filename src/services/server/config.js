import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const envFile = [".env", "env"]
  .map((file) => path.join(serverDirectory, file))
  .find((file) => existsSync(file));

if (envFile) {
  const { error } = dotenv.config({ path: envFile });
  if (error) {
    throw new Error(`Unable to load backend environment file: ${error.message}`);
  }
}

// A relative key path is resolved against this folder, not the terminal's cwd.
if (process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    !path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
    serverDirectory,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
  );
}

export function isConfigured(value) {
  return Boolean(value?.trim()) && !/your[-_ ]|placeholder|example/i.test(value);
}

export function credentialFileMissing() {
  return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) &&
    !existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

export function getSetupIssues() {
  const issues = [];

  if (credentialFileMissing()) {
    issues.push("Firebase Admin service-account file is missing");
  }

  const missingEmailSettings = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]
    .filter((key) => !isConfigured(process.env[key]));
  if (missingEmailSettings.length) {
    issues.push(`SMTP settings need configuration (${missingEmailSettings.join(", ")})`);
  }

  return issues;
}

// Credentials come from GOOGLE_APPLICATION_CREDENTIALS (service-account file)
// or Application Default Credentials; nothing is hardcoded.
initializeApp({
  credential: applicationDefault(),
  projectId:
    (isConfigured(process.env.FIREBASE_PROJECT_ID)
      ? process.env.FIREBASE_PROJECT_ID
      : process.env.GOOGLE_CLOUD_PROJECT) ||
    "clinic-management-system-c98ba",
  storageBucket:
    (isConfigured(process.env.FIREBASE_STORAGE_BUCKET)
      ? process.env.FIREBASE_STORAGE_BUCKET
      : null) ||
    "clinic-management-system-c98ba.firebasestorage.app",
});

export const auth = getAuth();
export const db = getFirestore();

export function emailTransporter() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((key) => !isConfigured(process.env[key]));
  if (missing.length) {
    const error = new Error(`Email is not configured. Missing: ${missing.join(", ")}`);
    error.code = "email/not-configured";
    throw error;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}
