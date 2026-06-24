import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../api";
import { useAuth } from "../context/AuthContext";
import "./ProjectDetails.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      const res = await getProjectById(token, id);

      if (res && !res.error) {
        setProject(res);
      } else {
        // CHANGE: Temporary fallback data while backend connection is finalized
        setProject({
          id,
          name: "Concrete Beam Design - B1",
          formula_name: "Concrete Beam Design",
          description: "Concrete Beam Design, for New or Existing, Based on ACI 318-19",
          status: "Adequate",
          created_by: "John Engineer",
          updated_at: "May 22, 2024 • 2:45 PM",
        });
      }
    };

    loadProject();
  }, [token, id]);

  if (!project) {
    return (
      <main className="project-detail-page">
        <p className="project-loading">Loading project...</p>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <section className="project-detail-shell">
        <button className="project-back-btn" onClick={() => navigate("/projects")}>
          ← Back to Projects
        </button>

        <div className="project-detail-header">
          <div>
            <p className="project-breadcrumb">Projects / Concrete Beam / {project.name}</p>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
          </div>

          <div className="project-detail-actions">
            <button className="project-primary-btn">Edit Project</button>
            <button className="project-secondary-btn">Export Report</button>
          </div>
        </div>

        <div className="project-summary-grid">
          <article className="project-summary-card">
            <span>Formula</span>
            <strong>{project.formula_name}</strong>
          </article>

          <article className="project-summary-card">
            <span>Project Status</span>
            <strong className="status-good">● {project.status}</strong>
          </article>

          <article className="project-summary-card">
            <span>Last Modified</span>
            <strong>{project.updated_at}</strong>
          </article>

          <article className="project-summary-card">
            <span>Created By</span>
            <strong>{project.created_by}</strong>
          </article>
        </div>

        <div className="project-main-grid">
          <section className="project-card">
            <h2>Input Data & Design Summary</h2>

            <div className="detail-two-column">
              <div>
                <h3>Material Properties</h3>
                <DetailRow label="Concrete Strength (f'c)" value="3 ksi" note="21 MPa" />
                <DetailRow label="Rebar Strength - Main (fy)" value="60 ksi" note="414 MPa" />
                <DetailRow label="Stirrup Strength (fy)" value="60 ksi" note="414 MPa" />

                <h3>Factored Loads</h3>
                <DetailRow label="Factored Bending Moment (Mu)" value="53.2 ft-kips" note="72 kN-m" />
                <DetailRow label="Factored Shear Force (Vu)" value="16.8 kips" note="75 kN" />
                <DetailRow label="Factored Torsional Moment (Tu)" value="0 ft-kips" note="0 kN-m" />
              </div>

              <div>
                <h3>Section Dimensions</h3>
                <DetailRow label="bw Width" value="8 in" note="203 mm" />
                <DetailRow label="h Overall Depth" value="16 in" note="406 mm" />
                <DetailRow label="hf Flange Thickness" value="0 in" note="0 mm" />
                <DetailRow label="b Flange Width" value="8 in" note="203 mm" />

                <h3>Reinforcement</h3>
                <DetailRow label="Compression Reinforcement" value="2 #6" />
                <DetailRow label="Tension Reinforcement" value="2 #6" />
                <DetailRow label="Shear Reinforcement" value="2 legs #3 @ 6 in o.c." />
              </div>
            </div>
          </section>

          <section className="project-card diagram-card">
            <h2>Section & Reinforcement Diagram</h2>

            <div className="beam-diagram">
              <div className="beam-top"></div>
              <div className="beam-web"></div>
              <div className="beam-rebar top-left"></div>
              <div className="beam-rebar top-right"></div>
              <div className="beam-rebar bottom-left"></div>
              <div className="beam-rebar bottom-right"></div>
              <span className="diagram-label label-b">b</span>
              <span className="diagram-label label-h">h</span>
              <span className="diagram-label label-bw">bw</span>
            </div>

            <p className="diagram-status">● The design is adequate.</p>
          </section>

          <section className="project-card">
            <h2>Analysis & Design Checks</h2>

            <CheckCard
              number="1"
              title="Flexural Capacity Check"
              status="Satisfactory"
              values={[
                ["ϕMn", "53.88 ft-kips"],
                ["Mu Applied", "53.2 ft-kips"],
                ["Capacity Ratio", "0.99"],
                ["Result", "OK"],
              ]}
            />

            <CheckCard
              number="2"
              title="Shear Capacity Check"
              status="Satisfactory"
              values={[
                ["ϕVn", "45.2 kips"],
                ["Vu Applied", "16.8 kips"],
                ["Capacity Ratio", "0.37"],
                ["Result", "OK"],
              ]}
            />

            <CheckCard
              number="3"
              title="Torsion Capacity Check"
              status="Not Applicable"
              values={[
                ["Tu Applied", "0 ft-kips"],
                ["Tcr", "4.7 ft-kips"],
                ["Requirement", "Not Required"],
                ["Result", "N/A"],
              ]}
            />
          </section>

          <section className="project-card">
            <h2>Calculation Details</h2>

            <div className="calculation-tabs">
              <button className="active">Flexural</button>
              <button>Shear</button>
              <button>Torsion</button>
            </div>

            <div className="calculation-box">
              <h3>Key Results</h3>
              <DetailRow label="Effective Depth (d)" value="13.75 in" />
              <DetailRow label="Neutral Axis Depth (c)" value="3.63 in" />
              <DetailRow label="Compression Force (Cc)" value="35.47 kips" />
              <DetailRow label="Tension Force (Ts)" value="35.47 kips" />
              <DetailRow label="Nominal Moment Capacity (Mn)" value="59.87 ft-kips" />
              <DetailRow label="Design Moment Capacity (ϕMn)" value="53.88 ft-kips" />
            </div>

            <button className="project-secondary-btn full-width-btn">
              View Full Calculations
            </button>
          </section>

          <section className="project-card notes-card">
            <h2>Notes</h2>
            <p>
              Design is based on ACI 318-19 requirements. All capacities include strength
              reduction factors.
            </p>
          </section>

          <section className="project-card notes-card">
            <h2>Documents & Attachments</h2>
            <p>No attachments yet.</p>
            <button className="project-secondary-btn">Upload File</button>
          </section>
        </div>
      </section>
    </main>
  );
}

function DetailRow({ label, value, note }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>
        {value} {note && <em>({note})</em>}
      </strong>
    </div>
  );
}

function CheckCard({ number, title, status, values }) {
  return (
    <article className="check-card">
      <div className="check-card-header">
        <div>
          <span className="check-number">{number}</span>
          <h3>{title}</h3>
        </div>
        <span className={status === "Satisfactory" ? "check-status good" : "check-status neutral"}>
          {status}
        </span>
      </div>

      <div className="check-values">
        {values.map((item) => (
          <div key={item[0]}>
            <span>{item[0]}</span>
            <strong>{item[1]}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}