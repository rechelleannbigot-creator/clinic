import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import { requestPatientApi } from "./userManagementService";

export async function getManagedStaff() {
  const result = await requestPatientApi("/api/admin/staff");
  if (!Array.isArray(result.staff)) throw new Error("The staff service returned an invalid staff list.");
  return result.staff;
}

export async function getManagedStaffProfile(uid) {
  const result = await requestPatientApi(`/api/admin/staff/${encodeURIComponent(uid)}`);
  if (!result.staff?.uid) throw new Error("The staff service returned an invalid staff profile.");
  return result.staff;
}

export async function createManagedStaff(staff) {
  const result = await requestPatientApi("/api/admin/staff", {
    method: "POST",
    body: JSON.stringify(staff),
  });
  if (!result.staff?.uid) throw new Error("The staff service did not return the created account.");
  return result.staff;
}

export async function updateManagedStaff(uid, staff) {
  const result = await requestPatientApi(`/api/admin/staff/${encodeURIComponent(uid)}`, {
    method: "PUT",
    body: JSON.stringify(staff),
  });
  if (!result.staff?.uid) throw new Error("The staff service did not return the updated account.");
  return result.staff;
}

export const deleteManagedStaff = (uid) =>
  requestPatientApi(`/api/admin/staff/${encodeURIComponent(uid)}`, { method: "DELETE" });

export async function sendStaffPasswordSetupEmail(email) {
  if (!auth.currentUser) throw new Error("Please sign in again before sending an account setup email.");
  await sendPasswordResetEmail(auth, email);
}
