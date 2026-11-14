import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "./firebase";
import { requestPatientApi } from "./userManagementService";

export async function getStaffProfile() {
  const result = await requestPatientApi("/api/staff/me/profile");
  if (!result.profile) throw new Error("The clinic service returned an invalid profile.");
  return result.profile;
}

export async function saveStaffProfile(profile) {
  const result = await requestPatientApi("/api/staff/me/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
  if (!result.profile) throw new Error("The clinic service returned an invalid profile.");
  return result.profile;
}

export async function changeStaffPassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user?.email || !user.providerData.some((provider) => provider.providerId === "password")) {
    throw new Error("Password changes are available only for email/password accounts.");
  }
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
  await updatePassword(user, newPassword);
}
