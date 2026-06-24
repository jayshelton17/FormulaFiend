// CHANGE: Added controlled form state for description and improved page layout
import { useState } from "react";
import { createProject } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CreateProject.css";

export default function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formulaId, setFormulaId] = useState("");
  const [variables, setVariables] = useState({
    variable1: "",
    variable2: "",
    variable3: "",
    variable4: "",
    variable5: "",
  });

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleVariableChange = (field, value) => {
    setVariables((prevVariables) => ({
      ...prevVariables,
      [field]: value,
    }));
  };

  const handleFormulaChange = (value) => {
    setFormulaId(value);

    setVariables({
      variable1: "",
      variable2: "",
      variable3: "",
      variable4: "",
      variable5: "",
    });
  };

  const handleCreate = async () => {
    if (!name.trim() || !formulaId) {
      alert("Please enter a project name and select a formula.");
      return;
    }

    const res = await createProject(token, {
      name,
      description,
      formula_id: formulaId,
      variables,
    });

    if (res.id) {
      alert("Project created!");
      navigate("/dashboard");
    } else {
      alert(res.error || "Something went wrong creating the project.");
    }
  };

  return (
    <main className="create-project-page">
      <section className="create-project-shell">
        <button
          className="create-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="create-project-header">
          <div>
            <p className="create-project-eyebrow">Project Workspace</p>
            <h1>Create New Project</h1>
            <p>
              Start a new engineering calculation project by providing the basic details.
            </p>
          </div>

          <button
            className="create-secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </div>

        <section className="create-project-card">
          <div className="create-card-section-title">
            <span className="create-section-icon">▤</span>
            <div>
              <h2>Project Information</h2>
              <p>Provide the basic details for your new project.</p>
            </div>
          </div>

          <div className="create-form-grid">
            <div className="create-form-group">
              <label>
                Project Name <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter project name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small>Give your project a descriptive name.</small>
            </div>

            <div className="create-form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter project description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <small>
                Add an optional description to help you remember the purpose of this project.
              </small>
            </div>
          </div>

          <div className="create-divider"></div>

          <div className="create-card-section-title">
            <span className="create-section-icon">▦</span>
            <div>
              <h2>Formula Selection</h2>
              <p>Choose the base formula that will be used for this project.</p>
            </div>
          </div>

          <div className="create-form-group full-width">
            <label>
              Select Formula <span>*</span>
            </label>
            <select
              value={formulaId}
              onChange={(e) => handleFormulaChange(e.target.value)}
            >
              <option value="">Select a formula...</option>
              <option value="1">Beam Deflection</option>
              <option value="2">Concrete Mix Design</option>
              <option value="3">Column Load Check</option>
              <option value="4">Pipe Flow Rate</option>
            </select>
            <small>
              This formula will be the foundation for your calculations in this project.
            </small>
          </div>

          {/* CHANGE: Variables section now only appears AFTER a formula is selected */}
          {formulaId && (
            <>
              <div className="create-divider"></div>

              <div className="create-card-section-title">
                <span className="create-section-icon">⌁</span>
                <div>
                  <h2>Project Variables</h2>
                  <p>
                    Enter the values needed for the selected formula. These fields can be customized later.
                  </p>
                </div>
              </div>

              <div className="create-variables-grid">
                <div className="create-form-group">
                  <label>Variable 1</label>
                  <input
                    type="number"
                    placeholder="Enter value..."
                    value={variables.variable1}
                    onChange={(e) =>
                      handleVariableChange("variable1", e.target.value)
                    }
                  />
                </div>

                <div className="create-form-group">
                  <label>Variable 2</label>
                  <input
                    type="number"
                    placeholder="Enter value..."
                    value={variables.variable2}
                    onChange={(e) =>
                      handleVariableChange("variable2", e.target.value)
                    }
                  />
                </div>

                <div className="create-form-group">
                  <label>Variable 3</label>
                  <input
                    type="number"
                    placeholder="Enter value..."
                    value={variables.variable3}
                    onChange={(e) =>
                      handleVariableChange("variable3", e.target.value)
                    }
                  />
                </div>

                <div className="create-form-group">
                  <label>Variable 4</label>
                  <input
                    type="number"
                    placeholder="Enter value..."
                    value={variables.variable4}
                    onChange={(e) =>
                      handleVariableChange("variable4", e.target.value)
                    }
                  />
                </div>

                <div className="create-form-group">
                  <label>Variable 5</label>
                  <input
                    type="number"
                    placeholder="Enter value..."
                    value={variables.variable5}
                    onChange={(e) =>
                      handleVariableChange("variable5", e.target.value)
                    }
                  />
                </div>
              </div>
            </>
          )}

          <div className="create-divider"></div>

          <div className="create-actions">
            <button
              className="create-secondary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button className="create-primary-btn" onClick={handleCreate}>
              + Create Project
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}