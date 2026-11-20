# Analytics Dashboard - Quick Start Guide

## Accessing the Analytics Dashboard

1. **Login** to your Clinic Management System as an Administrator
2. **Navigate** to the Admin Portal sidebar
3. **Click** "Analytics" in the "REPORTS & MONITORING" section
4. The Analytics Dashboard will load with data from the past month by default

## Understanding the Dashboard

### Top Summary Cards (KPI Cards)
At the top of the dashboard, you'll see 6 quick summary cards:

| Card | Shows |
|------|-------|
| **Total Registered Students** | Total number of registered students with number of records |
| **Total Consultations** | Total consultation records in the selected period |
| **Total Medicines Available** | Total medicine quantity available + number of medicine types |
| **Total Medicines Issued** | Total medicines distributed to students |
| **Clinic Staff** | Total staff members with number of active staff |
| **Low Stock Alerts** | Number of medicines below minimum stock level (requires attention) |

### Date Filtering

**Located in the top right, use these options:**

1. **Today** - View data for the current day only
2. **This Week** - View data from Monday to Sunday of the current week
3. **This Month** - View data for the current calendar month (default)
4. **This Year** - View data for the entire current year
5. **Custom** - Set your own start and end dates

**To use Custom Date Range:**
- Select "Custom" from the dropdown
- Enter Start Date (YYYY-MM-DD format)
- Enter End Date (YYYY-MM-DD format)
- Charts will automatically update

### Control Buttons

| Button | Function |
|--------|----------|
| **Refresh** | Manually refresh the analytics data (use if new records were added) |
| **Export** | Download analytics data as a CSV file for Excel or spreadsheet applications |
| **Print** | Print the entire dashboard in a printer-friendly format |

## Analytics Sections

### 1. Consultation Analytics
**Shows:** How many consultations are happening and what types

- **Monthly Consultation Trends** - See consultation volume by month (helpful for planning)
- **Consultation Types** - Breakdown of consultation types (General Checkup, Follow-up, etc.)
- **Common Diagnoses** - Top 10 most frequently diagnosed conditions
- **Daily Consultation Activity** - See consultation pattern over the last 30 days

**Use this to:** Identify busy months, understand common health issues, track consultation trends

### 2. Student Analytics
**Shows:** Information about registered students and their demographics

- **Student Overview** - Quick summary of total students and gender breakdown
- **Gender Distribution** - Visual breakdown of male/female/other students
- **Students by Year Level** - See which grade/year has the most students
- **Students by Course/Section** - Top 10 courses/sections by enrollment
- **Monthly Registrations** - Trend of new student registrations per month

**Use this to:** Understand student population, identify trends in enrollment, plan clinic resources

### 3. Medicine Inventory Analytics
**Shows:** Medicine stock levels, usage patterns, and expiration status

- **Inventory Overview** - Quick cards showing:
  - Total medicine types available
  - Total medicine quantity in stock
  - Number of medicines with low stock (⚠️ Needs reordering)
  - Number of out-of-stock medicines (🔴 Critical)
  - Number of expired medicines (must be removed)
  - Medicines expiring within 30 days (⚠️ Monitor closely)

- **Medicine Stock Levels** - Bar chart of top 15 medicines by quantity
- **Inventory Status** - Pie chart showing medicines by status (In Stock, Low Stock, Out of Stock)
- **Monthly Medicine Issuance Trends** - How many medicines are being used per month
- **Most Frequently Issued Medicines** - Top 10 medicines given to students
- **Medicines Approaching Expiration** - List of medicines expiring soon with expiry dates

**Use this to:** Manage medicine inventory, plan reorders, prevent stockouts, reduce waste from expired medicines

### 4. Clinic Staff Analytics
**Shows:** Staff activity and consultation performance

- **Staff Overview** - Total staff, active staff, and inactive staff
- **Consultations by Staff Member** - Bar chart showing how many consultations each staff member has conducted
- **Staff Performance Summary** - Table showing:
  - Staff ranking (#1, #2, etc.)
  - Staff name
  - Number of consultations conducted
  - Percentage of total consultations

**Use this to:** Monitor staff productivity, identify high-performing staff, ensure workload distribution

### 5. Analytics Insights
**Shows:** Automatically generated key findings and recommendations

**Examples of insights you'll see:**
- "January 2024 had the highest number of consultations with 245 records"
- "The most common diagnosis is 'Common Cold' with 65 cases"
- "5 medicines have reached low stock levels and need restocking"
- "2 medicines are expired and should be removed"

**Use this to:** Quickly understand important trends and what needs attention

## Common Tasks

### How to Check if Medicines Need Reordering
1. Look at the "Inventory Overview" cards in the Medicine Analytics section
2. Check the "Low Stock Alerts" card in the top summary
3. View "Medicines Approaching Expiration" for items that need urgent attention
4. Click "Export" to download the data for your procurement team

### How to Identify Your Busiest Months
1. Look at "Monthly Consultation Trends" chart
2. The peaks in the line chart show your busiest months
3. Use this information to plan staffing and stock levels

### How to Monitor Staff Performance
1. Go to "Staff Performance Summary" table
2. See which staff members handle the most consultations
3. Use percentage column to see contribution to total workload

### How to Track a Specific Medicine's Usage
1. Go to "Most Frequently Issued Medicines" chart
2. See how many units of each medicine were distributed
3. Compare with stock levels to ensure adequate supply

### How to Print for Reports
1. Click the "Print" button in the top right
2. Use your browser's print dialog (Ctrl+P or Cmd+P)
3. Select your printer and print settings
4. The dashboard will print in a clean, professional format

### How to Share Data with Others
1. Click "Export" button to download as CSV
2. Open the file in Excel or Google Sheets
3. Share the spreadsheet with relevant stakeholders
4. Data includes overview statistics, consultation types, diagnoses, and medicines

## Tips for Best Results

✅ **DO:**
- Review analytics weekly or monthly
- Use date filters to compare different periods
- Check medicine expiration dates regularly
- Monitor low stock alerts before stockouts happen
- Track consultation trends to plan resources
- Export data regularly for record-keeping

❌ **DON'T:**
- Ignore low stock warnings
- Leave expired medicines in inventory
- Assume current trends will continue without review
- Skip checking staff performance metrics
- Export sensitive patient data to unsecured locations

## Troubleshooting

### "No data available" message
- **Cause:** No records in database for the selected date range
- **Solution:** Try selecting a larger date range or switch to "This Year"

### Charts appear empty
- **Cause:** Still loading data
- **Solution:** Wait a few seconds for charts to render

### Export button doesn't work
- **Cause:** Browser might be blocking downloads
- **Solution:** Check browser settings, try a different browser, or allow downloads

### Date filter not updating charts
- **Cause:** Incorrect date format
- **Solution:** Ensure dates are in YYYY-MM-DD format (e.g., 2024-01-15)

### Outdated data in dashboard
- **Solution:** Click "Refresh" button to fetch latest data from database

## Need Help?

If you need assistance:
1. Contact your IT administrator
2. Check the system logs for detailed error messages
3. Verify you have administrator access
4. Ensure database connection is active

---

**Last Updated:** February 2024
**Version:** 1.0
**Supported Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
