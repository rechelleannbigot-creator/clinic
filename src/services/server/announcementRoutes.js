import { db } from "./config.js";
import { FieldValue } from "firebase-admin/firestore";
import express from "express";

function formatAnnouncement(doc) {
  const data = doc.data();
  return {
    announcementId: doc.id,
    title: data.title || "",
    category: data.category || "General Announcement",
    message: data.message || "",
    recipients: data.recipients || [],
    priority: data.priority || "Normal",
    attachment: data.attachment || null,
    status: data.status || "Draft",
    createdBy: data.createdBy || "",
    createdAt: data.createdAt?.toDate?.() || null,
    publishedAt: data.publishedAt?.toDate?.() || null,
    scheduledAt: data.scheduledAt?.toDate?.() || null,
    updatedAt: data.updatedAt?.toDate?.() || null,
  };
}

function getUser(req) {
  // Try to determine user role from their document in Firestore
  return { uid: req.authUser?.uid || "", role: req.authUser?.role || "student" };
}

export function registerAnnouncementRoutes(app, { db: database, requireSignedIn }) {
  const router = express.Router();

  // Apply authentication to all routes
  router.use(requireSignedIn);

  // ===== CREATE ANNOUNCEMENT (Admin only) =====
  router.post("/", async (req, res) => {
    try {
      const user = getUser(req);
      const userDoc = await database.collection("users").doc(user.uid).get();
      const role = String(userDoc.data()?.role || "").toLowerCase();

      if (role !== "admin" && role !== "administrator") {
        return res.status(403).json({ error: "Only administrators can create announcements." });
      }

      const { title, category, message, recipients, priority, attachment, status, scheduledAt } = req.body;

      if (!title?.trim() || !message?.trim() || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: "Title, message, and recipients are required." });
      }

      const announcementData = {
        title: title.trim(),
        category: category || "General Announcement",
        message: message.trim(),
        recipients,
        priority: priority || "Normal",
        attachment: attachment || null,
        status: status || "Draft",
        createdBy: user.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        publishedAt: status === "Published" ? FieldValue.serverTimestamp() : null,
        scheduledAt: status === "Scheduled" && scheduledAt ? new Date(scheduledAt) : null,
      };

      const docRef = await database.collection("announcements").add(announcementData);
      const newDoc = await docRef.get();

      res.json({ announcement: formatAnnouncement(newDoc) });
    } catch (error) {
      console.error("Create announcement error:", error.message);
      res.status(500).json({ error: "Failed to create announcement." });
    }
  });

  // ===== GET ALL ANNOUNCEMENTS (Admin only) =====
  router.get("/", async (req, res) => {
    try {
      const user = getUser(req);
      const userDoc = await database.collection("users").doc(user.uid).get();
      const role = String(userDoc.data()?.role || "").toLowerCase();

      if (role !== "admin" && role !== "administrator") {
        return res.status(403).json({ error: "Only administrators can view all announcements." });
      }

      const { status, limit = 50 } = req.query;
      let query = database.collection("announcements");

      if (status) {
        query = query.where("status", "==", status);
      }

      const snapshot = await query.orderBy("createdAt", "desc").limit(parseInt(limit)).get();
      const announcements = snapshot.docs.map(doc => formatAnnouncement(doc));

      res.json({ announcements });
    } catch (error) {
      console.error("Get announcements error:", error.message);
      res.status(500).json({ error: "Failed to retrieve announcements." });
    }
  });

  // ===== GET ANNOUNCEMENTS FOR CURRENT USER =====
  router.get("/user/announcements", async (req, res) => {
    try {
      const user = getUser(req);
      const userDoc = await database.collection("users").doc(user.uid).get();
      const userRole = String(userDoc.data()?.role || "").toLowerCase();

      let recipientFilter = ["All"];
      if (userRole === "student") {
        recipientFilter = ["All", "Students Only"];
      } else if (userRole === "staff" || userRole === "clinicstaff") {
        recipientFilter = ["All", "Clinic Staff Only"];
      }

      const snapshot = await database
        .collection("announcements")
        .where("status", "==", "Published")
        .where("recipients", "array-contains-any", recipientFilter)
        .orderBy("publishedAt", "desc")
        .limit(50)
        .get();

      const announcements = snapshot.docs.map(doc => formatAnnouncement(doc));

      // Get read status for user
      const readSnapshot = await database
        .collection("announcementReadStatus")
        .where("userId", "==", user.uid)
        .get();

      const readMap = {};
      readSnapshot.docs.forEach(doc => {
        readMap[doc.data().announcementId] = true;
      });

      const announcementsWithStatus = announcements.map(ann => ({
        ...ann,
        unread: !readMap[ann.announcementId],
      }));

      res.json({ announcements: announcementsWithStatus });
    } catch (error) {
      console.error("Get user announcements error:", error.message);
      res.status(500).json({ error: "Failed to retrieve announcements." });
    }
  });

  // ===== GET UNREAD COUNT =====
  router.get("/user/unread-count", async (req, res) => {
    try {
      const user = getUser(req);
      const userDoc = await database.collection("users").doc(user.uid).get();
      const userRole = String(userDoc.data()?.role || "").toLowerCase();

      let recipientFilter = ["All"];
      if (userRole === "student") {
        recipientFilter = ["All", "Students Only"];
      } else if (userRole === "staff" || userRole === "clinicstaff") {
        recipientFilter = ["All", "Clinic Staff Only"];
      }

      const readSnapshot = await database
        .collection("announcementReadStatus")
        .where("userId", "==", user.uid)
        .get();

      const readIds = new Set(readSnapshot.docs.map(doc => doc.data().announcementId));

      const announcementSnapshot = await database
        .collection("announcements")
        .where("status", "==", "Published")
        .where("recipients", "array-contains-any", recipientFilter)
        .get();

      let unreadCount = 0;
      announcementSnapshot.docs.forEach(doc => {
        if (!readIds.has(doc.id)) {
          unreadCount++;
        }
      });

      res.json({ unreadCount });
    } catch (error) {
      console.error("Get unread count error:", error.message);
      res.status(500).json({ error: "Failed to get unread count." });
    }
  });

  // ===== MARK AS READ =====
  router.post("/:announcementId/read", async (req, res) => {
    try {
      const user = getUser(req);
      const { announcementId } = req.params;

      const existingSnapshot = await database
        .collection("announcementReadStatus")
        .where("userId", "==", user.uid)
        .where("announcementId", "==", announcementId)
        .get();

      if (existingSnapshot.docs.length === 0) {
        await database.collection("announcementReadStatus").add({
          userId: user.uid,
          announcementId,
          readAt: FieldValue.serverTimestamp(),
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Mark read error:", error.message);
      res.status(500).json({ error: "Failed to mark announcement as read." });
    }
  });

  // ===== GET ANNOUNCEMENT DETAIL =====
  router.get("/:announcementId", async (req, res) => {
    try {
      const user = getUser(req);
      const { announcementId } = req.params;
      const userDoc = await database.collection("users").doc(user.uid).get();
      const userRole = String(userDoc.data()?.role || "").toLowerCase();

      const doc = await database.collection("announcements").doc(announcementId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Announcement not found." });
      }

      const announcement = formatAnnouncement(doc);

      // Check access
      if (userRole !== "admin" && userRole !== "administrator") {
        let hasAccess = false;

        if (announcement.recipients.includes("All")) {
          hasAccess = true;
        } else if ((userRole === "student") && announcement.recipients.includes("Students Only")) {
          hasAccess = true;
        } else if ((userRole === "staff" || userRole === "clinicstaff") && announcement.recipients.includes("Clinic Staff Only")) {
          hasAccess = true;
        }

        if (!hasAccess) {
          return res.status(403).json({ error: "You do not have access to this announcement." });
        }
      }

      res.json({ announcement });
    } catch (error) {
      console.error("Get announcement detail error:", error.message);
      res.status(500).json({ error: "Failed to retrieve announcement." });
    }
  });

  // ===== UPDATE ANNOUNCEMENT (Admin only) =====
  router.put("/:announcementId", async (req, res) => {
    try {
      const user = getUser(req);
      const userDoc = await database.collection("users").doc(user.uid).get();
      const role = String(userDoc.data()?.role || "").toLowerCase();

      if (role !== "admin" && role !== "administrator") {
        return res.status(403).json({ error: "Only administrators can update announcements." });
      }

      const { announcementId } = req.params;
      const doc = await database.collection("announcements").doc(announcementId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Announcement not found." });
      }

      const { title, category, message, recipients, priority, attachment, status, scheduledAt } = req.body;

      const updateData = { updatedAt: FieldValue.serverTimestamp() };

      if (title !== undefined) updateData.title = title.trim();
      if (category !== undefined) updateData.category = category;
      if (message !== undefined) updateData.message = message.trim();
      if (recipients !== undefined) updateData.recipients = recipients;
      if (priority !== undefined) updateData.priority = priority;
      if (attachment !== undefined) updateData.attachment = attachment;
      if (status !== undefined) {
        updateData.status = status;
        if (status === "Published") {
          updateData.publishedAt = FieldValue.serverTimestamp();
        }
        if (status === "Scheduled") {
          updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
        }
      }

      await database.collection("announcements").doc(announcementId).update(updateData);
      const updatedDoc = await database.collection("announcements").doc(announcementId).get();

      res.json({ announcement: formatAnnouncement(updatedDoc) });
    } catch (error) {
      console.error("Update announcement error:", error.message);
      res.status(500).json({ error: "Failed to update announcement." });
    }
  });

  // ===== DELETE ANNOUNCEMENT (Admin only) =====
  router.delete("/:announcementId", async (req, res) => {
    try {
      const user = getUser(req);
      const userDoc = await database.collection("users").doc(user.uid).get();
      const role = String(userDoc.data()?.role || "").toLowerCase();

      if (role !== "admin" && role !== "administrator") {
        return res.status(403).json({ error: "Only administrators can delete announcements." });
      }

      const { announcementId } = req.params;
      const doc = await database.collection("announcements").doc(announcementId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Announcement not found." });
      }

      await database.collection("announcements").doc(announcementId).delete();

      const readStatusSnapshot = await database
        .collection("announcementReadStatus")
        .where("announcementId", "==", announcementId)
        .get();

      const batch = database.batch();
      readStatusSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      res.json({ success: true });
    } catch (error) {
      console.error("Delete announcement error:", error.message);
      res.status(500).json({ error: "Failed to delete announcement." });
    }
  });

  // ===== PUBLISH ANNOUNCEMENT (Admin only) =====
  router.post("/:announcementId/publish", async (req, res) => {
    try {
      const user = getUser(req);
      const userDoc = await database.collection("users").doc(user.uid).get();
      const role = String(userDoc.data()?.role || "").toLowerCase();

      if (role !== "admin" && role !== "administrator") {
        return res.status(403).json({ error: "Only administrators can publish announcements." });
      }

      const { announcementId } = req.params;
      const doc = await database.collection("announcements").doc(announcementId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Announcement not found." });
      }

      await database.collection("announcements").doc(announcementId).update({
        status: "Published",
        publishedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await database.collection("announcements").doc(announcementId).get();

      res.json({ announcement: formatAnnouncement(updatedDoc) });
    } catch (error) {
      console.error("Publish announcement error:", error.message);
      res.status(500).json({ error: "Failed to publish announcement." });
    }
  });

  // ===== ARCHIVE ANNOUNCEMENT (Admin only) =====
  router.post("/:announcementId/archive", async (req, res) => {
    try {
      const user = getUser(req);
      const userDoc = await database.collection("users").doc(user.uid).get();
      const role = String(userDoc.data()?.role || "").toLowerCase();

      if (role !== "admin" && role !== "administrator") {
        return res.status(403).json({ error: "Only administrators can archive announcements." });
      }

      const { announcementId } = req.params;
      const doc = await database.collection("announcements").doc(announcementId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Announcement not found." });
      }

      await database.collection("announcements").doc(announcementId).update({
        status: "Archived",
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await database.collection("announcements").doc(announcementId).get();

      res.json({ announcement: formatAnnouncement(updatedDoc) });
    } catch (error) {
      console.error("Archive announcement error:", error.message);
      res.status(500).json({ error: "Failed to archive announcement." });
    }
  });

  app.use("/api/announcements", router);
}
