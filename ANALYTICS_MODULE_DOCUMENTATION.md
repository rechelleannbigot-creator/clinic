# Analytics Module - Implementation Guide

## Overview

The Analytics Dashboard is a comprehensive, professional-grade analytics module for the Clinic Management System that provides administrators with real-time insights into clinic operations, student health statistics, consultation trends, medicine inventory performance, and staff activities.

## Features Implemented

### 1. Summary Cards (KPI Cards)
- **Total Registered Students** - Total number of student/patient records with subtitle showing count
- **Total Consultations** - Total consultations recorded in the selected period
- **Total Medicines Available** - Total quantity of medicines in inventory with number of types
- **Total Medicines Issued** - Total quantity of medicines issued to students
- **Clinic Staff** - Total registered clinic staff with number of active staff
- **Low Stock Alerts** - Number of medicines below minimum stock level

### 2. Consultation Analytics
Interactive visualizations of clinic consultation activities:

#### Charts Implemented:
- **Monthly Consultation Trends** - Line chart showing consultation volume per month
- **Consultation Types Distribution** - Pie/doughnut chart showing consultation type breakdown
- **Common Diagnoses** - Horizontal bar chart showing top 10 most frequently diagnosed conditions
- **Daily Consultation Activity** - Bar chart showing daily consultation records (last 30 days)

### 3. Student Analytics
Comprehensive student statistics and demographics:

#### Visualizations:
- **Student Overview** - Summary cards showing gender distribution and total count
- **Gender Distribution** - Pie chart showing students by gender (Male, Female, Other)
- **Students by Year Level** - Bar chart showing enrollment by academic year
- **Students by Course/Section** - Horizontal bar chart showing top 10 courses by enrollment
- **Monthly Student Registrations** - Line chart showing new registrations per month

### 4. Medicine Inventory Analytics
Detailed medicine inventory tracking and monitoring:

#### Components:
- **Inventory Overview** - Summary cards showing:
  - Total medicine types
  - Total medicine quantity
  - Low stock count
  - Out of stock count
  - Expired medicines
  - Medicines expiring soon
  
#### Visualizations:
- **Medicine Stock Levels** - Horizontal bar chart showing top 15 medicines by quantity
- **Inventory Status** - Pie chart showing medicines by status (In Stock, Low Stock, Out of Stock)
- **Monthly Medicine Issuance Trends** - Line chart showing medicine issuance volume per month
- **Most Frequently Issued Medicines** - Bar chart showing top 10 issued medicines
- **Medicines Approaching Expiration** - List view showing medicines expiring within 30 days

### 5. Clinic Staff Analytics
Staff performance and activity tracking:

#### Components:
- **Staff Overview** - Summary cards showing total, active, and inactive staff
- **Consultations by Staff Member** - Horizontal bar chart showing consultation records per staff
- **Staff Performance Summary** - Table showing staff ranking, name, consultation count, and percentage of total

### 6. Analytics Insights
Automatic insights generation from clinic data:
- Month with highest consultation volume
- Most common diagnosis
- Most frequently reported symptom
- Most issued medicine
- Medicines needing restock
- Expired medicines warning
- Year level with highest enrollment

### 7. Date Filtering & Controls
Interactive filtering options:
- **Today** - Current day data only
- **This Week** - Current week (Monday-Sunday)
- **This Month** - Current calendar month
- **This Year** - Current calendar year
- **Custom Date Range** - User-defined start and end dates
- **Refresh Button** - Manual data refresh with loading indicator
- **Export Button** - Download analytics as CSV
- **Print Button** - Print-friendly view of analytics dashboard

### 8. Additional Features
- **Last Updated Timestamp** - Shows when analytics data was last refreshed
- **Loading States** - Spinner and loading message while data is fetching
- **Error Handling** - User-friendly error messages with retry option
- **Empty States** - Messages when no data is available
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Print Styling** - Optimized layout for printing

## Project Structure

```
C:\G1\clinic\
├── src/
│   ├── pages/Admin/
│   │   └── Analytics.jsx                 # Main Analytics component
│   ├── components/Analytics/
│   │   ├── AnalyticsCharts.jsx          # Consultation analytics charts
│   │   ├── AnalyticsStudents.jsx        # Student demographics & trends
│   │   ├── AnalyticsMedicines.jsx       # Medicine inventory analytics
│   │   ├── AnalyticsStaff.jsx           # Staff performance analytics
│   │   └── AnalyticsInsights.jsx        # Key insights display
│   ├── styles/
│   │   └── Analytics.css                # Complete analytics styling
│   └── services/server/
│       ├── server.js                    # Backend API server
│       └── analyticsRoutes.js           # Analytics API endpoint
├── package.json
└── dist/                                 # Built project
```

## Backend API Endpoint

### GET /api/admin/analytics

**Authentication:** Required (Admin only)

**Query Parameters:**
- `startDate` (optional) - Start date in YYYY-MM-DD format (default: 30 days ago)
- `endDate` (optional) - End date in YYYY-MM-DD format (default: today)

**Response:**
```json
{
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "overview": {
    "totalStudents": 150,
    "totalConsultations": 245,
    "totalMedicineTypes": 42,
    "totalMedicineQuantity": 1240,
    "lowStockMedicines": 8,
    "outOfStockMedicines": 2,
    "expiredMedicines": 1,
    "expiringMedicines": 5,
    "totalMedicineIssued": 892,
    "totalStaff": 5,
    "activeStaff": 4,
    "inactiveStaff": 1
  },
  "students": {
    "total": 150,
    "byGender": { "Male": 78, "Female": 70, "Other": 2 },
    "byYearLevel": { "Grade 7": 25, "Grade 8": 30, ... },
    "byCourse": { "BSCS": 45, "BSHS": 38, ... },
    "monthlyRegistrations": { "2024-01": 15, "2024-02": 18, ... }
  },
  "consultations": {
    "total": 245,
    "monthlyTrends": { "2024-01": 120, "2024-02": 125 },
    "dailyActivity": { "2024-01-15": 8, "2024-01-16": 12, ... },
    "byType": { "General Checkup": 100, "Follow-up": 85, ... },
    "commonDiagnoses": { "Common Cold": 45, "Headache": 38, ... },
    "commonSymptoms": { "Fever": 65, "Cough": 52, ... },
    "byStaff": { "Maria Santos": 95, "Jose Reyes": 150 }
  },
  "medicines": {
    "stockDistribution": [
      { "name": "Paracetamol", "quantity": 500, "unit": "tablets", ... }
    ],
    "monthlyIssuances": { "2024-01": 450, "2024-02": 442 },
    "mostIssuedMedicines": { "Paracetamol": 450, "Ibuprofen": 320, ... },
    "expiringMedicines": [
      { "name": "Amoxicillin", "expirationDate": "2024-03-15", "quantity": 100 }
    ]
  },
  "staff": {
    "total": 5,
    "active": 4,
    "inactive": 1,
    "consultationsByStaff": { "Maria Santos": 95, "Jose Reyes": 150 }
  },
  "insights": [
    "January 2024 had the highest number of consultations with 120 records.",
    "The most common diagnosis is 'Common Cold' with 45 cases.",
    ...
  ],
  "generatedAt": "2024-02-15T10:30:00.000Z"
}
```

## Firebase Collections Used

The Analytics module retrieves data from the following Firebase Firestore collections:

### 1. `patients`
- Student/patient registration records
- Fields: firstName, lastName, age, gender, yearLevel, course, section, email, contact, createdAt

### 2. `consultations`
- Consultation records
- Fields: patientId, patientName, consultationType, symptoms, diagnosis, treatment, medicineId, quantity, clinicStaff, consultationDate, createdAt

### 3. `medicines`
- Medicine inventory
- Fields: name, category, quantity, unit, reorderLevel, expirationDate, createdAt

### 4. `medicineIssuances`
- Medicine issuance records
- Fields: patientId, medicineName, quantity, dosage, instructions, issuedBy, createdAt

### 5. `users`
- User accounts including clinic staff
- Fields: role (staff/clinicstaff), status (Active/ACTIVE/Inactive), email, createdAt

## Installation & Setup

### 1. Install Dependencies
```bash
# Install Recharts (already installed)
npm list recharts

# If not installed:
npm install recharts
```

### 2. Backend Configuration
Ensure the backend server has the analytics route registered in `server.js`:
```javascript
import { registerAnalyticsRoutes } from "./analyticsRoutes.js";
// ... in route registration:
registerAnalyticsRoutes(app, { db, requireAdmin: requireAdministrator });
```

### 3. Access the Module
Navigate to: `/admin/analytics`

Required role: Administrator

## Libraries & Technologies

### Frontend:
- **React 19.2.8** - UI framework
- **Recharts 3.x** - Data visualization library
- **Lucide React 1.35.0** - Icon library
- **CSS3** - Styling with responsive design

### Backend:
- **Express.js 5.3.0** - API server
- **Firebase Admin SDK 14.5.0** - Firebase integration
- **Firebase Firestore** - Database

## Styling

### Color Scheme:
- **Primary Blue:** #1677c8 (Main brand color)
- **Dark Blue:** #173b63 (Text headings)
- **Green:** #16a05d (Success/positive)
- **Orange:** #ffa500 (Warnings)
- **Red:** #c5192d (Critical/errors)
- **Background:** #f5f7fb (Page background)
- **Card Background:** White (#ffffff)
- **Borders:** #e5edf5 (Light gray)

### Design Features:
- Clean, modern dashboard aesthetic
- Rounded corners (8-12px)
- Subtle shadows for depth
- Responsive grid layouts
- Accessible color contrasts
- Professional healthcare theme

## Security & Authorization

- ✅ Admin-only access enforced via backend `requireAdmin` middleware
- ✅ Firebase authentication tokens required (Bearer token in Authorization header)
- ✅ Aggregated statistics only (no individual patient details exposed)
- ✅ Filtered data based on selected date range
- ✅ No sensitive medical information stored client-side

## Performance Optimizations

- Efficient Firestore queries with date range filtering
- Client-side data aggregation to minimize database reads
- Lazy loading of chart components
- Responsive images and SVG icons
- CSS grid for flexible layouts
- Optimized Recharts configuration

## Responsive Design

The Analytics Dashboard is fully responsive:

| Screen Size | Layout |
|-------------|--------|
| **Desktop** (>1200px) | 6-column KPI grid, full-width charts |
| **Tablet** (768-1200px) | 3-column KPI grid, responsive charts |
| **Mobile** (<768px) | 1-column KPI grid, stacked layouts, optimized controls |

## Troubleshooting

### Issue: Analytics page shows "No data available"
**Solution:** Ensure your Firebase database contains consultation, medicine, and patient records within the selected date range.

### Issue: Charts not displaying
**Solution:** Check browser console for errors, verify Recharts is installed: `npm list recharts`

### Issue: "Only administrators can access" error
**Solution:** Ensure your user account has "Administrator" role in Firebase users collection.

### Issue: Date filters not working
**Solution:** Verify the date format is YYYY-MM-DD and check that records in the database have proper `createdAt` timestamps.

### Issue: Export/Print not working
**Solution:** Ensure your browser allows downloads and print permissions.

## Future Enhancement Ideas

1. **Advanced Filtering** - Filter by specific staff member, medicine category, student year level
2. **Comparison Mode** - Compare analytics between two date ranges
3. **Custom Reports** - Save and schedule recurring reports
4. **Data Predictions** - ML-based forecasting for medicine demand
5. **Alerts & Thresholds** - Automatic notifications for critical low stock items
6. **Dashboard Customization** - Admin can choose which widgets to display
7. **Export Formats** - PDF, Excel, JSON export options
8. **Real-time Updates** - WebSocket integration for live data
9. **API Rate Limiting** - Implement rate limiting for analytics endpoint
10. **Audit Logging** - Track analytics access for compliance

## Support & Maintenance

For issues or questions:
1. Check the browser console for errors
2. Verify Firebase connection and credentials
3. Ensure admin role is properly assigned in Firebase
4. Review backend logs: `npm run server:start`
5. Check date format consistency (YYYY-MM-DD)
6. Verify Recharts library is installed and imported correctly

## Version History

**Version 1.0.0 (Current)**
- Initial release
- 5 main analytics sections (Consultations, Students, Medicines, Staff, Insights)
- Real-time data from Firebase
- Interactive charts with Recharts
- Date range filtering
- Export and print functionality
- Responsive design for all devices
- Professional styling and UX
