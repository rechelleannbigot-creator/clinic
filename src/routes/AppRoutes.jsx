import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import StaffDashboard from "../pages/Clinicstaff/StaffDashboard";
import StudentDashboard from "../pages/Student/StudentDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import RoleRoute from "./RoleRoute";
import AdminLayout from "../layouts/AdminLayout";
import ManageUser from "../pages/Admin/ManageUser";
import Reports from "../pages/Admin/Reports";
import Page from "../pages/Admin/Page";


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
                    <Route path="reports" element={<Reports />} />
                    <Route path="page" element={<Page />} />

                </Route>


                <Route
                    path="/staff"
                    element={
                        <RoleRoute allowedRole="clinicstaff">
                            <StaffDashboard />
                        </RoleRoute>

                    }
                />

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
