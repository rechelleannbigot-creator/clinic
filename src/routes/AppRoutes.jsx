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
import NewConsultation from "../pages/Clinicstaff/NewConsultation";
import MedicalRecords from "../pages/Clinicstaff/MedicalRecords";
import Consultation from "../pages/Clinicstaff/Consultation";
import Inventory from "../pages/Clinicstaff/Inventory";
import Issuance from "../pages/Clinicstaff/Issuance";
import StaffReports from "../pages/Clinicstaff/StaffReports";
import Notifications from "../pages/Clinicstaff/Notifications";
import StudentMedicalProfile from "../pages/Clinicstaff/StudentMedicalProfile";
import AddPatient from "../pages/Clinicstaff/AddPatient";

// ==============================
// Student
// ==============================
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/Student/StudentDashboard";
import MyConsultation from "../pages/Student/MyConsultation";
import BookConsultation from "../pages/Student/BookConsultation";
import StudentMedicalRecords from "../pages/Student/StudentMedicalRecords";
import MyMedicine from "../pages/Student/MyMedicine";
import MedicalProfile from "../pages/Student/MedicalProfile";

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
                        path="new-consultation"
                        element={<NewConsultation />}
                    />

                    <Route
                        path="add-patient"
                        element={<AddPatient />}
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

                    <Route
                        path="student-medical-profile"
                        element={<StudentMedicalProfile />}
                    />
                
                </Route>




                {/* =================================
                    STUDENT ROUTES
                ================================= */}
                <Route
                    path="/student"
                    element={
                        <RoleRoute allowedRole="student">
                            <StudentLayout />
                        </RoleRoute>
                    }
                >   
                <Route index element={<StudentDashboard />} />
                <Route path="my-consultation" element={<MyConsultation />} />
                <Route path="book-consultation" element={<BookConsultation />} />
                <Route path="student-medical-records" element={<StudentMedicalRecords />} />
                <Route path="my-medicine" element={<MyMedicine />} />
                <Route path="medical-profile" element={<MedicalProfile />} />

                </Route>

                
                

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
