import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Unauthorized from "./pages/Unauthorized";
import CreateProject from "./pages/CreateProject";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Formulas from "./pages/Formulas";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/formulas" element={<Formulas />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;