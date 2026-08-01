import { useState } from "react";
import { login } from "../services/authService";
import "../styles/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const userCredential = await login(email, password);

      console.log("Login Successful");
      console.log(userCredential.user);

      alert("Login Successful!");
    } catch (error) {
      console.error(error);

      alert(error.message);
    }
  };



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