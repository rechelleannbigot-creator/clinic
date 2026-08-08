import { useState, useEffect } from "react";
import "../styles/Login.css";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";
import { getUserData } from "../services/userService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        try {
            const userCredential = await login(email, password); // Authenticate the user
            const userData = await getUserData(userCredential.user.uid);    // Get the user's Firestore document
            console.log(userData); // Display the data in the console

            await login(email, password);

            alert("Login Successful!");

            if (!userData) {
                alert("User profile not found.");
                return;
            }
            if (userData.role === "admin") {
                navigate("/admin");
            } else if (userData.role === "clinicstaff") {
                navigate("/staff");
            } else if (userData.role === "student") {
                navigate("/student");
            } else {
                alert("Invalid user role.");
            }


        } catch (error) {
            alert(error.message);
        }

    };

    useEffect(() => {
        const redirectUser = async () => {
            if (!user) return;

            try {
                const userData = await getUserData(user.uid);

                if (!userData) return;

                if (userData.role === "admin") {
                    navigate("/admin", { replace: true });
                } else if (userData.role === "client") {
                    navigate("/client", { replace: true });
                }
            } catch (error) {
                console.error("Error checking user role:", error);
            }
        };

        redirectUser();
    }, [user, navigate]);



    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Voting System</h1>
                <p>Please sign in to continue.</p>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;


