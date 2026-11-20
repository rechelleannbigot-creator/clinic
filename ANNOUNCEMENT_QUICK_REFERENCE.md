# Announcement Module - Quick Reference Guide

## 📍 Navigation Routes

### Admin Access
- **Dashboard**: `/admin/notifications`
- **Create New**: Click "Create Announcement" button
- **Manage**: View, Edit, Publish, Archive, Delete from table

### Student Access
- **Dashboard**: `/student/announcements`
- **View Details**: Click on any announcement card
- **Notifications**: Badge shows unread count

### Staff Access
- **Dashboard**: `/staff/announcements`
- **View Details**: Click on any announcement card
- **Notifications**: Badge shows unread count

---

## 🎯 Key Features at a Glance

### Admin Announcement Dashboard
```
Admin Dashboard → Announcements
├── Summary Cards (Total, Published, Draft, Scheduled)
├── Filter by Status
├── Search by Title/ID
├── Announcements Table with Actions
└── "+ Create Announcement" Button
```

### Create Announcement Form
```
Required Fields:
✓ Title (text)
✓ Category (dropdown - 6 options)
✓ Message (textarea)
✓ Recipients (checkboxes - 4 options)
✓ Priority (dropdown - 3 options)
✓ Publication Option (dropdown - 3 options)

Conditional:
? Schedule Date/Time (if "Schedule" selected)

Optional:
○ Attachment (file)
```

### Student/Staff Announcements View
```
Announcements List
├── Announcement Cards with
│   ├── Category Badge (color-coded)
│   ├── Title
│   ├── Priority (if not Normal)
│   ├── Message Preview (150 chars)
│   ├── Published Date
│   └── Read Status Indicator
├── Unread Badge in Sidebar
└── View Details Modal
```

---

## 🔄 Announcement Lifecycle

### Create Flow
1. Click "+ Create Announcement"
2. Fill in form fields
3. Select recipients
4. Choose publication option:
   - **Publish Immediately**: Goes live now
   - **Save as Draft**: Can edit later
   - **Schedule**: Set future date/time
5. Submit form
6. Announcement appears in table

### Edit Flow
1. Click Edit icon on draft announcement
2. Modify fields
3. Update publication option
4. Submit changes
5. Announcement updated

### Publish Flow
1. Click Publish icon on draft
2. Select publication option
3. Confirm
4. Announcement goes live (or scheduled)

### Archive Flow
1. Click Archive icon on published announcement
2. Confirm
3. Announcement moved to archived status
4. No longer visible to users

### Delete Flow
1. Click Delete icon
2. Confirm deletion
3. Announcement permanently removed

---

## 📊 Database Records

### Two Main Collections

#### `announcements`
Stores announcement data:
- id, title, category, message
- recipients, priority, status
- attachment, createdBy, timestamps

#### `announcementReadStatus`
Tracks read/unread for each user:
- announcementId, userId
- read status, readAt timestamp

---

## 🔐 Access Control Matrix

| Action | Admin | Student | Staff |
|--------|-------|---------|-------|
| Create | ✅ | ❌ | ❌ |
| Edit Draft | ✅ | ❌ | ❌ |
| Publish | ✅ | ❌ | ❌ |
| Archive | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ |
| View All | ✅ | ❌ | ❌ |
| View Own Role | ✅ | ✅ | ✅ |
| Mark as Read | ✅ | ✅ | ✅ |

---

## 🎨 Styling Reference

### Category Colors
- **General**: #1677C8 (Blue)
- **Health Advisory**: #22C55E (Green)
- **Clinic Schedule**: #F59E0B (Amber)
- **Medical Reminder**: #3B82F6 (Light Blue)
- **Emergency**: #EF4444 (Red)
- **Important Notice**: #EC4899 (Pink)

### UI Colors
- **Primary**: #173B63 (Dark Blue)
- **Secondary**: #1677C8 (Blue)
- **Background**: #F5F7FB (Light Gray)
- **Cards**: #FFFFFF (White)

---

## 🛠️ API Endpoints Summary

### Admin Endpoints
```
POST   /api/announcements              Create
GET    /api/announcements              Get all (with filters)
PUT    /api/announcements/:id          Update
DELETE /api/announcements/:id          Delete
POST   /api/announcements/:id/publish  Publish
POST   /api/announcements/:id/archive  Archive
```

### User Endpoints
```
GET  /api/announcements/user/announcements      Get user's announcements
GET  /api/announcements/user/unread-count       Get unread count
GET  /api/announcements/:id                     Get details (with access check)
POST /api/announcements/:id/read                Mark as read
```

---

## 📋 Validation Rules

### Title
- Required
- Cannot be empty
- Max 200 characters

### Category
- Required
- Must be one of 6 options

### Message
- Required
- Cannot be empty
- Recommended: 50-500 characters

### Recipients
- At least one must be selected
- Options: All Students, All Clinic Staff, Students Only, Clinic Staff Only

### Priority
- Required
- Options: Normal, Important, Urgent

### Scheduled Date (if scheduling)
- Must be in the future
- Format: YYYY-MM-DD HH:MM
- Cannot be in the past

---

## ⚡ Performance Tips

### For Administrators
- Use drafts for work-in-progress announcements
- Schedule announcements during off-peak hours
- Archive old announcements regularly
- Use search to find specific announcements

### For Best Results
- Keep messages concise (under 500 characters)
- Use clear, descriptive titles
- Choose accurate categories
- Select correct recipients carefully
- Schedule during appropriate times

---

## 🧪 Quick Test Checklist

### Admin Testing
- [ ] Create announcement with all fields
- [ ] Try submitting empty form (should fail)
- [ ] Create draft and edit it
- [ ] Publish draft announcement
- [ ] Schedule future announcement
- [ ] Archive published announcement
- [ ] Delete announcement
- [ ] Search by title
- [ ] Filter by status

### Student/Staff Testing
- [ ] Log in as student
- [ ] View announcements dashboard
- [ ] See unread count badge
- [ ] Click to view announcement
- [ ] Verify auto-marks as read
- [ ] Check unread count decreases
- [ ] Log in as staff
- [ ] Repeat above tests
- [ ] Verify access control (can't see staff-only as student)

---

## 🔧 Configuration Files

### Routes
**File**: `src/routes/AppRoutes.jsx`

```javascript
// Admin route
<Route path="/admin/notifications" element={<Announcements />} />

// Student route
<Route path="/student/announcements" element={<StudentAnnouncements />} />

// Staff route
<Route path="/staff/announcements" element={<StaffAnnouncements />} />
```

### Backend Routes
**File**: `src/services/server/announcementRoutes.js`

All 11 endpoints configured and registered in `server.js` at line 30:
```javascript
registerAnnouncementRoutes(app, { db, requireSignedIn });
```

---

## 📞 Common Issues & Solutions

### Issue: Announcements not appearing
**Solution**:
1. Verify status is "Published"
2. Check recipients include your role
3. Refresh page
4. Check browser console

### Issue: Can't create announcement
**Solution**:
1. Verify you're logged in as admin
2. Fill all required fields
3. Select at least one recipient
4. Check form validation messages

### Issue: Unread count not updating
**Solution**:
1. Refresh page
2. Clear browser cache
3. Check backend is running
4. Verify API endpoint responds

### Issue: Modal won't close
**Solution**:
1. Click X button
2. Click outside modal
3. Press Escape key
4. Refresh page

---

## 📚 File Structure Reference

```
clinic/
├── src/
│   ├── pages/
│   │   ├── Admin/
│   │   │   └── Announcements.jsx          ⭐ Admin dashboard
│   │   ├── Student/
│   │   │   └── StudentAnnouncements.jsx   ⭐ Student view
│   │   └── Clinicstaff/
│   │       └── StaffAnnouncements.jsx     ⭐ Staff view
│   ├── services/
│   │   ├── server/
│   │   │   ├── server.js                  (modified - line 30)
│   │   │   └── announcementRoutes.js      ⭐ Backend API
│   │   └── announcementService.js         ⭐ API service layer
│   ├── styles/
│   │   ├── Announcements.css              ⭐ Admin styling
│   │   ├── StudentAnnouncements.css       ⭐ Student styling
│   │   └── StaffAnnouncements.css         ⭐ Staff styling
│   └── routes/
│       └── AppRoutes.jsx                  (modified - routes added)
└── 📄 Documentation
    ├── ANNOUNCEMENT_MODULE_SUMMARY.md     ✅ Complete guide
    └── ANNOUNCEMENT_INTEGRATION_CHECKLIST.md ✅ Testing guide
```

---

## 🚀 Getting Started

### 1. Start the Application
```bash
# Install dependencies (if needed)
npm install

# Build the application
npm run build

# Start backend
npm run server:start

# In another terminal, start frontend
npm run dev
```

### 2. Access Admin Dashboard
1. Navigate to `http://localhost:5173`
2. Log in as admin
3. Go to Admin > Announcements
4. Click "+ Create Announcement"

### 3. Create Test Announcement
- Title: "Welcome to Clinic"
- Category: "General Announcement"
- Message: "Welcome to our clinic management system"
- Recipients: "All Students"
- Priority: "Normal"
- Publication: "Publish Immediately"
- Click Submit

### 4. View as Student
1. Log out and log in as student
2. Go to Student > Announcements
3. See announcement appears
4. Click to view full details
5. See unread count decreases

---

## ✨ Next Steps

After deployment:
1. Train administrators on creating announcements
2. Set up announcement schedule
3. Test with real student/staff accounts
4. Monitor performance
5. Gather feedback for improvements

---

**Last Updated**: 2024
**Status**: ✅ Ready for Production
