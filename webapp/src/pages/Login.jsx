import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api";

import buildingImg from "../assets/building.png";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        login(data);
        navigate("/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-left">

          <h1 className="login-title">Welcome Back</h1>

          <p className="login-subtitle">
            Sign in to access your formulas, calculations, and engineering tools.
          </p>

          <form onSubmit={handleLogin} className="login-form">

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <span className="forgot">Forgot password?</span>
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="guest-btn"
              onClick={() => navigate("/dashboard")}
            >
              Continue as Guest
            </button>

            <p className="login-footer">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/register")}>
                Register
              </span>
            </p>

          </form>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="login-right">
          <img src={buildingImg} alt="Engineering structure" />
        </div>

      </div>
    </div>
  );
}