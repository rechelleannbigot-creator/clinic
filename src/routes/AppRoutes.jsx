import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import StaffDashboard from "../pages/Clinicstaff/StaffDashboard";
import StudentDashboard from "../pages/Student/StudentDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import RoleRoute from "./RoleRoute";
import AdminLayout from "../layouts/AdminLayout";
import ManageUser from "../pages/Admin/ManageUser";
import Patients from "../pages/Admin/Patients";
import Reports from "../pages/Admin/Reports";
import StaffLayout from "../layouts/StaffLayout";
import MedicalRecords from "../pages/Admin/Medical Records";
import Consultations from "../pages/Admin/Consultations";
import MedicineInventory from "../pages/Admin/Medicine Inventory";
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
                    <Route path="patients" element={<Patients />} />
                    <Route path="medical-records" element={<MedicalRecords />} />
                    <Route path="consultations" element={<Consultations />} />
                    <Route path="medicine-inventory" element={<MedicineInventory />} />

                </Route>


                <Route
                    path="/staff"
                    element={
                        <RoleRoute allowedRole="staff">
                            <StaffLayout />
                        </RoleRoute>

                    }
                >
                    <Route index element={<StaffDashboard />} />
                    

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
