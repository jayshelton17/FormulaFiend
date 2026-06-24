import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import buildingImg from "../assets/building.png";
import "./register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(username, email, password);

      if (data.id || data.message) {
        alert("Account created!");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        {/* LEFT */}
        <div className="register-left">
          <h1 className="register-title">Create Account</h1>

          <p className="register-subtitle">
            Sign up to start using FormulaFiend
          </p>

          <form className="register-form" onSubmit={handleRegister}>

            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="register-btn" type="submit">
              Register
            </button>

            <p className="register-footer">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>
                Login
              </span>
            </p>

          </form>
        </div>

        {/* RIGHT */}
        <div className="register-right">
          <img src={buildingImg} alt="Engineering" />
        </div>

      </div>
    </div>
  );
}