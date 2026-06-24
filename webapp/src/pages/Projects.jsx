// CHANGE: Added Projects page to display past projects
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Projects.css";

export default function Projects() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formulaFilter, setFormulaFilter] = useState("all");
  const [sortOption, setSortOption] = useState("recent");

  useEffect(() => {
    const loadProjects = async () => {
      const res = await getProjects(token);

      if (Array.isArray(res)) {
        setProjects(res);
      } else {
        setProjects([
          {
            id: 1,
            name: "Steel Beam Deflection Check",
            description: "Analysis of simply supported steel beam",
            formula_name: "Beam Deflection",
            updated_at: "May 22, 2024",
          },
          {
            id: 2,
            name: "Concrete Mix Design - C30",
            description: "Mix proportion for M30 grade concrete",
            formula_name: "Concrete Mix Design",
            updated_at: "May 21, 2024",
          },
          {
            id: 3,
            name: "Column Load Capacity Check",
            description: "Axial load capacity for RC column",
            formula_name: "Column Load Check",
            updated_at: "May 19, 2024",
          },
          {
            id: 4,
            name: "Water Pipe Flow Analysis",
            description: "Flow rate calculation for water pipeline",
            formula_name: "Pipe Flow Rate",
            updated_at: "May 15, 2024",
          },
          {
            id: 5,
            name: "Steel Column Buckling Check",
            description: "Buckling analysis for H-section column",
            formula_name: "Column Load Check",
            updated_at: "May 8, 2024",
          },
        ]);
      }
    };

    loadProjects();
  }, [token]);

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFormula =
        formulaFilter === "all" || project.formula_name === formulaFilter;

      return matchesSearch && matchesFormula;
    })
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      }

      return b.id - a.id;
    });

  return (
    <main className="projects-page">
      <section className="projects-shell">
        <div className="projects-header">
          <div>
            <p className="projects-eyebrow">Projects</p>
            <h1>My Projects</h1>
            <p>View and manage all your engineering calculation projects.</p>
          </div>

          <button
            className="projects-primary-btn"
            onClick={() => navigate("/create-project")}
          >
            + Create Project
          </button>
        </div>

        <section className="projects-panel">
          <div className="projects-toolbar">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="projects-toolbar-actions">
              <select
                value={formulaFilter}
                onChange={(e) => setFormulaFilter(e.target.value)}
              >
                <option value="all">All Formulas</option>
                <option value="Beam Deflection">Beam Deflection</option>
                <option value="Concrete Mix Design">Concrete Mix Design</option>
                <option value="Column Load Check">Column Load Check</option>
                <option value="Pipe Flow Rate">Pipe Flow Rate</option>
              </select>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recent">Sort by: Recent</option>
                <option value="name">Sort by: Name</option>
              </select>
            </div>
          </div>

          <div className="projects-table">
            <div className="projects-table-header">
              <span>Project Name</span>
              <span>Formula</span>
              <span>Last Modified</span>
              <span>Actions</span>
            </div>

            {filteredProjects.map((project) => (
              <div className="projects-row" key={project.id}>
                <div className="project-name-cell">
                  <span className="project-icon">▥</span>
                  <div>
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                  </div>
                </div>

                <div className="project-formula-cell">
                  <span>▦</span>
                  {project.formula_name}
                </div>

                <div className="project-date-cell">
                  <strong>{project.updated_at || "Recently"}</strong>
                </div>

                <div className="project-actions-cell">
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Open
                  </button>
                  <button className="project-more-btn">...</button>
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="projects-empty">
                No projects found.
              </div>
            )}
          </div>

          <div className="projects-footer">
            <p>
              Showing {filteredProjects.length} of {projects.length} projects
            </p>

            <div className="projects-pagination">
              <button>‹</button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>›</button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}