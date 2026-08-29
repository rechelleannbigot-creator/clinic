import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import StaffDashboard from "../pages/Clinicstaff/StaffDashboard";
import StudentDashboard from "../pages/Student/StudentDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import RoleRoute from "./RoleRoute";
import AdminLayout from "../layouts/AdminLayout";
import ManageUser from "../pages/Admin/ManageUser";
import PatientsManagement from "../pages/Admin/Patients Management";
import StaffLayout from "../layouts/StaffLayout";
import MedicalRecords from "../pages/Clinicstaff/Medical Records";
import Consultations from "../pages/Admin/Consultations";
import MedicineInventory from "../pages/Admin/Medicine Inventory";
import MedicineIssuance from "../pages/Admin/Medicine Issuance";
import Reports from "../pages/Admin/Reports";
import Notification from "../pages/Admin/Notification";
import Analytics from "../pages/Admin/Analytics";
import Logout from "../pages/Admin/Logout";
import ScanQRCode from "../pages/Clinicstaff/Scan QR code";
import MyProfile from "../pages/Admin/MyProfile";
import NewConsultation from "../pages/Clinicstaff/New Consultation";
import Patients from "../pages/Clinicstaff/Patients";
import Consultation from "../pages/Clinicstaff/Consultation";
import Inventory from "../pages/Clinicstaff/Inventory";
import Issuance from "../pages/Clinicstaff/Issuance";
import StaffReports from "../pages/Clinicstaff/StaffReports";
import Notifications from "../pages/Clinicstaff/Notifications";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/admin"
                    element={
                        <RoleRoute allowedRole="admin">
                            <AdminLayout />
                        </RoleRoute>

                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="manage-users" element={<ManageUser />} />
                    <Route path="patients-management" element={<PatientsManagement />} />
                    <Route path="consultations" element={<Consultations />} />
                    <Route path="medicine-inventory" element={<MedicineInventory />} />
                    <Route path="medicine-issuance" element={<MedicineIssuance />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="notifications" element={<Notification />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="my-profile" element={<MyProfile />} />
                    <Route path="logout" element={<Logout />} />

                </Route>


                
                <Route path="/" element={<Login />} />
                <Route
                    path="/staff"
                    element={
                        <RoleRoute allowedRole="staff">
                            <StaffLayout />
                        </RoleRoute>

                    }
                >
                    <Route index element={<StaffDashboard />} />
                    <Route path="scan-qr-code" element={<ScanQRCode />} />
                    <Route path="new-consultation" element={<NewConsultation />} />
                    <Route path="patients" element={<Patients />} />
                    <Route path="medical-records" element={<MedicalRecords />} />
                    <Route path="consultation" element={<Consultation />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="issuance" element={<Issuance />} />
                    <Route path="staff-reports" element={<StaffReports />} />
                    <Route path="notifications" element={<Notifications />} />

                </Route>

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
