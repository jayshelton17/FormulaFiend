import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/formula_fiend_logo.png";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <img
          src={logo}
          alt="FormulaFiend Logo"
          className="navbar__logo"
        />
      </div>

      <div className="navbar__links">
        <NavLink to="/" className="navbar__link">
          Home
        </NavLink>

        {user && (
          <NavLink to="/dashboard" className="navbar__link">
            Dashboard
          </NavLink>
        )}

        {user?.role === "admin" && (
          <NavLink to="/admin" className="navbar__link">
            Admin Panel
          </NavLink>
        )}
      </div>

      <div className="navbar__auth">
        {!user ? (
          <NavLink to="/login" className="navbar__login">
            Login
          </NavLink>
        ) : (
          <button className="navbar__logout" onClick={() => logout(true)}>
            Logout <span>({user.name})</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;