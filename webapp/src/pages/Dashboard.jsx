import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjects } from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(token);

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Unexpected response:", data);
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Dashboard</p>
            <h1>Welcome back, {user?.username || "User"}!</h1>
            <p>Ready to solve today’s engineering challenges.</p>
          </div>

          <button
            className="dashboard-primary-btn"
            onClick={() => navigate("/create-project")}
          >
            + Create Project
          </button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="dashboard-grid">
          <button
            className="dashboard-card"
            onClick={() => navigate("/projects")}
          >
            <span className="dashboard-icon">▦</span>
            <div>
              <h2>My Projects</h2>
              <p>Review past projects</p>
            </div>
          </button>

          <button
            className="dashboard-card"
            onClick={() => navigate("/formulas")}
          >
            <span className="dashboard-icon">⌁</span>
            <div>
              <h2>Formulas</h2>
              <p>Browse saved formulas & calculations</p>
            </div>
          </button>

          <button className="dashboard-card">
            <span className="dashboard-icon">⇄</span>
            <div>
              <h2>Units</h2>
              <p>Unit conversions made easy</p>
            </div>
          </button>

          <button className="dashboard-card">
            <span className="dashboard-icon">▤</span>
            <div>
              <h2>Resources</h2>
              <p>Helpful references and guides</p>
            </div>
          </button>
        </div>

        {/* PROJECT LIST */}
        <section className="recent-panel">
          <div className="recent-panel-header">
            <h2>My Projects</h2>
            <button onClick={() => navigate("/projects")}>
              View All
            </button>
          </div>

          <div className="recent-list">
            {loading ? (
              <p>Loading projects...</p>
            ) : projects.length === 0 ? (
              <p>No projects yet.</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="recent-item">
                  <span>{project.name}</span>
                  <small>ID: {project.id}</small>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}