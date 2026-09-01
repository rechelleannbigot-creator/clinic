import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==============================
// Authentication
// ==============================
import Login from "../pages/Login";
import RoleRoute from "./RoleRoute";

// ==============================
// Admin
// ==============================
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/Admindashboard";
import ManageUser from "../pages/Admin/ManageUser";
import PatientsManagement from "../pages/Admin/PatientsManagement";
import Consultations from "../pages/Admin/Consultations";
import MedicineInventory from "../pages/Admin/MedicineInventory";
import MedicineIssuance from "../pages/Admin/MedicineIssuance";
import Reports from "../pages/Admin/Reports";
import Notification from "../pages/Admin/Notification";
import Analytics from "../pages/Admin/Analytics";
import MyProfile from "../pages/Admin/MyProfile";
import Logout from "../pages/Admin/Logout";

// ==============================
// Clinic Staff
// ==============================
import StaffLayout from "../layouts/StaffLayout";
import StaffDashboard from "../pages/Clinicstaff/StaffDashboard";
import ScanQRCode from "../pages/Clinicstaff/ScanQRcode";
import NewConsultation from "../pages/Clinicstaff/NewConsultation";
import Patients from "../pages/Clinicstaff/Patients";
import MedicalRecords from "../pages/Clinicstaff/MedicalRecords";
import Consultation from "../pages/Clinicstaff/Consultation";
import Inventory from "../pages/Clinicstaff/Inventory";
import Issuance from "../pages/Clinicstaff/Issuance";
import StaffReports from "../pages/Clinicstaff/StaffReports";
import Notifications from "../pages/Clinicstaff/Notifications";

// ==============================
// Student
// ==============================
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/Student/StudentDashboard";


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =================================
                    LOGIN
                ================================= */}
                <Route path="/" element={<Login />} />


                {/* =================================
                    ADMIN ROUTES
                ================================= */}
                <Route
                    path="/admin"
                    element={
                        <RoleRoute allowedRole="admin">
                            <AdminLayout />
                        </RoleRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />

                    <Route
                        path="manage-users"
                        element={<ManageUser />}
                    />

                    <Route
                        path="patients-management"
                        element={<PatientsManagement />}
                    />

                    <Route
                        path="consultations"
                        element={<Consultations />}
                    />

                    <Route
                        path="medicine-inventory"
                        element={<MedicineInventory />}
                    />

                    <Route
                        path="medicine-issuance"
                        element={<MedicineIssuance />}
                    />

                    <Route
                        path="reports"
                        element={<Reports />}
                    />

                    <Route
                        path="notifications"
                        element={<Notification />}
                    />

                    <Route
                        path="analytics"
                        element={<Analytics />}
                    />

                    <Route
                        path="my-profile"
                        element={<MyProfile />}
                    />

                    <Route
                        path="logout"
                        element={<Logout />}
                    />
                </Route>


                {/* =================================
                    CLINIC STAFF ROUTES
                ================================= */}
                <Route
                    path="/staff"
                    element={
                        <RoleRoute allowedRole="staff">
                            <StaffLayout />
                        </RoleRoute>
                    }
                >
                    <Route index element={<StaffDashboard />} />

                    <Route
                        path="scan-qr-code"
                        element={<ScanQRCode />}
                    />

                    <Route
                        path="new-consultation"
                        element={<NewConsultation />}
                    />

                    <Route
                        path="patients"
                        element={<Patients />}
                    />

                    <Route
                        path="medical-records"
                        element={<MedicalRecords />}
                    />

                    <Route
                        path="consultation"
                        element={<Consultation />}
                    />

                    <Route
                        path="inventory"
                        element={<Inventory />}
                    />

                    <Route
                        path="issuance"
                        element={<Issuance />}
                    />

                    <Route
                        path="staff-reports"
                        element={<StaffReports />}
                    />

                    <Route
                        path="notifications"
                        element={<Notifications />}
                    />
                </Route>


                {/* =================================
                    STUDENT ROUTES
                ================================= */}
                <Route path="/student">
    <Route index element={<StudentLayout />} />
</Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
