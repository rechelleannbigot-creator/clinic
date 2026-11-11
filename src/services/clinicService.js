import { requestPatientApi } from "./userManagementService";

async function list(path, key) {
  const result = await requestPatientApi(path);
  if (!Array.isArray(result[key])) throw new Error(`The clinic service returned an invalid ${key} list.`);
  return result[key];
}

export const getMedicines = () => list("/api/medicines", "medicines");
export const getConsultations = (patientId = "") =>
  list(`/api/consultations${patientId ? `?patientId=${encodeURIComponent(patientId)}` : ""}`, "consultations");
export const getMyConsultations = () => list("/api/my-consultations", "consultations");

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
