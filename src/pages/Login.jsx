import { useState } from "react";
import "../styles/Login.css";

import { login } from "../services/authService";
import { getUserData } from "../services/userService";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // FORM STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // HANDLE LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    //  CLEAR / VALIDATE
    if (!email.trim() || !password) {
      alert("Please enter your email and password.");

      return;
    }

    try {
      setLoading(true);

      //  FIREBASE AUTHENTICATION
      const userCredential = await login(email.trim(), password);
      const firebaseUser = userCredential.user;
      console.log("Authenticated user:", firebaseUser);

      //  GET FIRESTORE USER PROFILE
      const userData = await getUserData(firebaseUser.uid);
      console.log("Firestore user profile:", userData);

      // USER PROFILE DOES NOT EXIST
      if (!userData) {
        alert("User profile not found. Please contact the administrator.");

        return;
      }

      // TEMPORARY PASSWORD
      if (userData.mustChangePassword === true) {
        navigate("/change-password", {
          replace: true,
        });

        return;
      }

      // ROLE
      const role = userData.role?.toLowerCase();

      // ADMIN
      if (role === "admin") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }

      // STAFF
      if (role === "clinicstaff") {
        navigate("/staff", {
          replace: true,
        });

        return;
      }

      // CUSTOMER
      if (role === "student") {
        navigate("/student", {
          replace: true,
        });

        return;
      }

      // INVALID ROLE
      alert(
        "Your account does not have a valid role. Please contact the administrator.",
      );
    } catch (error) {
      console.error("Login error:", error);

      // FIREBASE AUTH ERRORS
      switch (error.code) {
        case "auth/invalid-credential":
          alert("Incorrect email or password.");

          break;

        case "auth/user-not-found":
          alert("No account was found with this email.");

          break;

        case "auth/wrong-password":
          alert("Incorrect password.");

          break;

        case "auth/invalid-email":
          alert("Please enter a valid email address.");

          break;

        case "auth/user-disabled":
          alert(
            "This account has been disabled. Please contact the administrator.",
          );

          break;

        default:
          alert(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay"></div>

      <div className="login-card">
        <div className="logo-section">
          <img src={logo} alt="LCC Logo" className="school-logo" />

          <div className="divider"></div>

          <h3>Clinic Management</h3>

          <span> System</span>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder=" Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="/">Forgot Password?</a>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <div className="footer">
          <p>UNITY • CHARITY • TRUTH</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
