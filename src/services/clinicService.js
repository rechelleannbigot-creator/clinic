import { requestPatientApi } from "./userManagementService";

async function list(path, key) {
  const result = await requestPatientApi(path);
  if (!Array.isArray(result[key])) throw new Error(`The clinic service returned an invalid ${key} list.`);
  return result[key];
}

export const getMedicines = () => list("/api/medicines", "medicines");
export const getIssuances = (patientId = "") =>
  list(`/api/medicine-issuances${patientId ? `?patientId=${encodeURIComponent(patientId)}` : ""}`, "issuances");
export async function saveIssuance(data) {
  const result = await requestPatientApi("/api/medicine-issuances", { method: "POST", body: JSON.stringify(data) });
  if (!result.issuance?.issuanceId) throw new Error("The clinic service did not return the saved issuance. Retry without changing the form.");
  return result.issuance;
}
export const getConsultations = (patientId = "") =>
  list(`/api/consultations${patientId ? `?patientId=${encodeURIComponent(patientId)}` : ""}`, "consultations");
export const getMyConsultations = () => list("/api/my-consultations", "consultations");
export const getStaffDashboard = () => requestPatientApi("/api/staff/dashboard");
export const markDashboardNotificationRead = (id) =>
  requestPatientApi(`/api/staff/dashboard/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
export const getDashboardPatient = async (id) => {
  const result = await requestPatientApi(`/api/staff/dashboard/patients/${encodeURIComponent(id)}`);
  if (!result.patient?.id) throw new Error("The clinic service returned an invalid patient.");
  return result.patient;
};

export async function saveConsultation(data) {
  const result = await requestPatientApi("/api/consultations", { method: "POST", body: JSON.stringify(data) });
  if (!result.consultation?.consultationId) throw new Error("The clinic service did not return the saved consultation. Retry without clearing the form.");
  return result.consultation;
}

export async function saveMedicine(data, id) {
  const result = await requestPatientApi(id ? `/api/medicines/${encodeURIComponent(id)}` : "/api/medicines", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(data),
  });
  if (!result.medicine?.id) throw new Error("The clinic service did not return the saved medicine.");
  return result.medicine;
}

export const removeMedicine = (id) =>
  requestPatientApi(`/api/medicines/${encodeURIComponent(id)}`, { method: "DELETE" });

export const deleteConsultation = (id) =>
  requestPatientApi(`/api/consultations/${encodeURIComponent(id)}`, { method: "DELETE" });
