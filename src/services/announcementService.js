import { requestPatientApi } from "./userManagementService";

// ===================================
// CREATE ANNOUNCEMENT
// ===================================
export async function createAnnouncement(data) {
  const result = await requestPatientApi("/api/announcements", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!result.announcement?.announcementId) {
    throw new Error("Failed to create announcement.");
  }
  return result.announcement;
}

// ===================================
// GET ALL ANNOUNCEMENTS (Admin)
// ===================================
export async function getAllAnnouncements(status = null, limit = 50) {
  const params = new URLSearchParams({ limit });
  if (status) {
    params.append("status", status);
  }
  const result = await requestPatientApi(`/api/announcements?${params}`);
  if (!Array.isArray(result.announcements)) {
    throw new Error("Invalid announcements response.");
  }
  return result.announcements;
}

// ===================================
// GET USER ANNOUNCEMENTS
// ===================================
export async function getUserAnnouncements() {
  const result = await requestPatientApi("/api/announcements/user/announcements");
  if (!Array.isArray(result.announcements)) {
    throw new Error("Invalid announcements response.");
  }
  return result.announcements;
}

// ===================================
// GET UNREAD COUNT
// ===================================
export async function getAnnouncementUnreadCount() {
  const result = await requestPatientApi("/api/announcements/user/unread-count");
  if (typeof result.unreadCount !== "number") {
    throw new Error("Invalid unread count response.");
  }
  return result.unreadCount;
}

// ===================================
// MARK AS READ
// ===================================
export async function markAnnouncementAsRead(announcementId) {
  const result = await requestPatientApi(
    `/api/announcements/${encodeURIComponent(announcementId)}/read`,
    { method: "POST" }
  );
  return result.success === true;
}

// ===================================
// GET ANNOUNCEMENT DETAIL
// ===================================
export async function getAnnouncementDetail(announcementId) {
  const result = await requestPatientApi(
    `/api/announcements/${encodeURIComponent(announcementId)}`
  );
  if (!result.announcement?.announcementId) {
    throw new Error("Invalid announcement response.");
  }
  return result.announcement;
}

// ===================================
// UPDATE ANNOUNCEMENT
// ===================================
export async function updateAnnouncement(announcementId, data) {
  const result = await requestPatientApi(
    `/api/announcements/${encodeURIComponent(announcementId)}`,
    { method: "PUT", body: JSON.stringify(data) }
  );
  if (!result.announcement?.announcementId) {
    throw new Error("Failed to update announcement.");
  }
  return result.announcement;
}

// ===================================
// DELETE ANNOUNCEMENT
// ===================================
export async function deleteAnnouncement(announcementId) {
  const result = await requestPatientApi(
    `/api/announcements/${encodeURIComponent(announcementId)}`,
    { method: "DELETE" }
  );
  return result.success === true;
}

// ===================================
// PUBLISH ANNOUNCEMENT
// ===================================
export async function publishAnnouncement(announcementId) {
  const result = await requestPatientApi(
    `/api/announcements/${encodeURIComponent(announcementId)}/publish`,
    { method: "POST" }
  );
  if (!result.announcement?.announcementId) {
    throw new Error("Failed to publish announcement.");
  }
  return result.announcement;
}

// ===================================
// ARCHIVE ANNOUNCEMENT
// ===================================
export async function archiveAnnouncement(announcementId) {
  const result = await requestPatientApi(
    `/api/announcements/${encodeURIComponent(announcementId)}/archive`,
    { method: "POST" }
  );
  if (!result.announcement?.announcementId) {
    throw new Error("Failed to archive announcement.");
  }
  return result.announcement;
}
