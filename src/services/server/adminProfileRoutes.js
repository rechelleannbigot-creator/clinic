import { FieldValue } from "firebase-admin/firestore";
import { Buffer } from "node:buffer";

const editableFields = ["firstName", "middleName", "lastName", "email", "phone", "photoURL", "username"];
const clean = (value) => typeof value === "string" ? value.trim() : "";

function profileForResponse(data, authUser) {
  return {
    uid: authUser?.uid || "",
    firstName: data.firstName ?? "",
    middleName: data.middleName ?? "",
    lastName: data.lastName ?? "",
    fullName: [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" "),
    email: authUser?.email || data.email || "",
    phone: data.phone || data.contact || "",
    username: data.username || authUser?.email?.split("@")[0] || "",
    role: data.role || "Administrator",
    accountStatus: (authUser?.disabled) ? "Inactive" : "Active",
    photoURL: data.photoURL || "",
    dateCreated: data.createdAt || "",
    lastLogin: authUser?.metadata?.lastSignInTime || "",
    emailVerified: authUser?.emailVerified || false,
  };
}

function validatePhoto(value) {
  if (value === "") return true;
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) return false;
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 200 * 1024 || bytes.toString("base64") !== match[2]) return false;
  if (match[1] === "jpeg") return bytes.length >= 3 && bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (match[1] === "png") return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
}

function normalizeUpdates(body) {
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).some((key) => !editableFields.includes(key)) ||
      editableFields.filter((key) => key !== "photoURL").some((key) => typeof body[key] !== "string") ||
      ("photoURL" in body && typeof body.photoURL !== "string")) {
    throw new Error("Provide only the editable profile fields.");
  }
  
  const data = Object.fromEntries(editableFields.filter((key) => key in body).map((key) => [key, clean(body[key])]));
  
  if (!data.firstName || !data.lastName) {
    throw new Error("First and last name are required.");
  }
  
  if (["firstName", "middleName", "lastName"].some((key) => data[key].length > 100)) {
    throw new Error("A profile field is too long.");
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error("Enter a valid email address.");
  }
  
  if (data.phone && (!/^[\d+()\s-]+$/.test(data.phone) || data.phone.replace(/\D/g, "").length < 7 || data.phone.replace(/\D/g, "").length > 15)) {
    throw new Error("Enter a valid contact number containing 7 to 15 digits.");
  }
  
  if (data.username && (data.username.length < 3 || data.username.length > 50)) {
    throw new Error("Username must be between 3 and 50 characters.");
  }
  
  if ("photoURL" in data && !validatePhoto(data.photoURL)) {
    throw new Error("Choose a valid JPEG, PNG, or WebP image no larger than 200 KB.");
  }
  
  return data;
}

export function registerAdminProfileRoutes(app, { db, auth, requireAdmin }) {
  
  app.get("/api/admin/me/profile", requireAdmin, async (req, res) => {
    try {
      const authUser = await auth.getUser(req.authUser.uid);
      const userDoc = await db.collection("users").doc(req.authUser.uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ message: "Admin profile not found." });
      }
      
      return res.json({ profile: profileForResponse(userDoc.data(), authUser) });
    } catch (error) {
      console.error("Get admin profile error:", error.message);
      return res.status(500).json({ message: "Unable to load your profile. Please try again." });
    }
  });

  app.put("/api/admin/me/profile", requireAdmin, async (req, res) => {
    let updates;
    let currentAuthUser;
    
    try {
      updates = normalizeUpdates(req.body);
      currentAuthUser = await auth.getUser(req.authUser.uid);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    
    try {
      const authUpdates = {};
      
      if (updates.email && updates.email !== currentAuthUser.email) {
        authUpdates.email = updates.email;
        authUpdates.emailVerified = false;
      }
      
      if (Object.keys(authUpdates).length > 0) {
        await auth.updateUser(req.authUser.uid, authUpdates);
      }
      
      const firebaseUpdates = {
        ...updates,
        contact: updates.phone,
        updatedAt: FieldValue.serverTimestamp(),
      };
      
      await db.collection("users").doc(req.authUser.uid).update(firebaseUpdates);
      
      const updatedUserDoc = await db.collection("users").doc(req.authUser.uid).get();
      const updatedAuthUser = await auth.getUser(req.authUser.uid);
      
      return res.json({ profile: profileForResponse(updatedUserDoc.data(), updatedAuthUser) });
    } catch (error) {
      console.error("Update admin profile error:", error.message);
      
      if (error.code === "auth/email-already-exists") {
        return res.status(409).json({ message: "That email address is already associated with an account." });
      }
      
      return res.status(500).json({ message: "Unable to save your profile. Please try again." });
    }
  });

  app.post("/api/admin/me/change-password", requireAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All password fields are required." });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirmation do not match." });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long." });
      }
      
      if (currentPassword === newPassword) {
        return res.status(400).json({ message: "New password must be different from the current password." });
      }
      
      try {
        await auth.updateUser(req.authUser.uid, {
          password: newPassword,
        });
        
        return res.json({ message: "Password changed successfully." });
      } catch (error) {
        if (error.code === "auth/invalid-password") {
          return res.status(400).json({ message: "Password does not meet security requirements. Try a stronger password." });
        }
        throw error;
      }
    } catch (error) {
      console.error("Change password error:", error.message);
      return res.status(500).json({ message: "Unable to change password. Please try again." });
    }
  });
}
