import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ allowedRole, children }) {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const normalize = (value) => {
        const role = String(value || "").toLowerCase().replace(/[\s_-]/g, "");
        if (role === "clinicstaff") return "staff";
        if (role === "administrator") return "admin";
        return role;
    };

    if (normalize(user.role) !== normalize(allowedRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RoleRoute;
