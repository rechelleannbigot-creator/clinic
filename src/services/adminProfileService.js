import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_CLINIC_API_URL || "http://localhost:5000";

async function getAuthToken() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    return await user.getIdToken();
  } catch (error) {
    throw new Error("Unable to get authentication token");
  }
}

export async function getAdminProfile() {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/me/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load admin profile");
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    throw error;
  }
}

export async function updateAdminProfile(updates) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/me/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update admin profile");
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    throw error;
  }
}

export async function changeAdminPassword(currentPassword, newPassword, confirmPassword) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/me/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to change password");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    throw error;
  }
}
