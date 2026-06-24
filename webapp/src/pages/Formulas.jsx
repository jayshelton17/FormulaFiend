import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getFormulas,
  getEngineFormulas,
  runCalculation,
} from "../api";

export default function Formulas() {
  const { token } = useAuth();

  const [dbFormulas, setDbFormulas] = useState([]);
  const [engineFormulas, setEngineFormulas] = useState([]);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const [inputs, setInputs] = useState({
    fc: 4,
    fy: 60,
    Mu: 200,
    Vu: 20,
    Tu: 0,
    bw: 12,
    h: 24,
    cover: 1.5,
    bottomBars: { bar: "#5", count: 2 },
    topBars: { bar: "#4", count: 2 },
    stirrups: { bar: "#3", legs: 2, spacing: 6 },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const db = await getFormulas(token);
        const engine = await getEngineFormulas(token);

        setDbFormulas(Array.isArray(db) ? db : []);
        setEngineFormulas(Array.isArray(engine) ? engine : []);
      } catch (err) {
        console.error(err);
        setDbFormulas([]);
        setEngineFormulas([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
  }, [token]);

  // ✅ FIXED: no endpoint parsing bugs
const handleRun = async () => {
  if (!selectedFormula) return;

  try {
    const res = await runCalculation(
      token,
      selectedFormula.endpoint, // <-- IMPORTANT CHANGE
      inputs
    );

    setResult(res);
  } catch (err) {
    console.error(err);
    alert("Calculation failed");
  }
};

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1>Formulas</h1>

      {loading && <p>Loading...</p>}

      {/* =========================
          DATABASE FORMULAS
      ========================= */}
      <h2>Saved Formulas (Database)</h2>

      {dbFormulas.length === 0 ? (
        <p>No saved formulas found.</p>
      ) : (
        dbFormulas.map((f) => (
          <div key={f.id} style={{ marginBottom: "10px" }}>
            <h3>{f.name}</h3>
            <p>{f.calculation}</p>
          </div>
        ))
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* =========================
          ENGINE FORMULAS
      ========================= */}
      <h2>Engineering Calculations</h2>

      {engineFormulas.length === 0 ? (
        <p>No engine formulas available.</p>
      ) : (
        engineFormulas.map((f, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedFormula(f);
              setResult(null);
            }}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "10px",
              width: "250px",
              background:
                selectedFormula?.name === f.name ? "#444" : "#222",
              color: "white",
              border: "1px solid #555",
              cursor: "pointer",
            }}
          >
            {f.name.toUpperCase()}
          </button>
        ))
      )}

      {/* =========================
          INPUTS
      ========================= */}
      {selectedFormula && (
        <div style={{ marginTop: "2rem" }}>
          <h2>{selectedFormula.name} Inputs</h2>

          <input
            type="number"
            value={inputs.fc}
            onChange={(e) =>
              setInputs({ ...inputs, fc: Number(e.target.value) })
            }
            placeholder="fc"
          />
          <br />

          <input
            type="number"
            value={inputs.fy}
            onChange={(e) =>
              setInputs({ ...inputs, fy: Number(e.target.value) })
            }
            placeholder="fy"
          />
          <br />

          <input
            type="number"
            value={inputs.Mu}
            onChange={(e) =>
              setInputs({ ...inputs, Mu: Number(e.target.value) })
            }
            placeholder="Mu"
          />
          <br />

          <button onClick={handleRun} style={{ marginTop: "10px" }}>
            Run Calculation
          </button>
        </div>
      )}

      {/* =========================
          RESULT
      ========================= */}
      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Result</h2>

          {/* OVERALL */}
          {result.summary && (
            <div
              style={{
                padding: "1rem",
                background: result.summary.overallSatisfactory
                  ? "#1e4620"
                  : "#5a1e1e",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <h3>
                Overall:{" "}
                {result.summary.overallSatisfactory ? "PASS ✅" : "FAIL ❌"}
              </h3>
            </div>
          )}

          {/* FLEXURE */}
          {result.flexure && (
            <div style={{ marginBottom: "1rem" }}>
              <h3>Flexure</h3>
              <p>φMn: {result.flexure.phiMn?.toFixed(2)}</p>
              <p>Mu: {result.flexure.Mu}</p>
              <p>
                Status:{" "}
                {result.flexure.satisfactory ? "PASS ✅" : "FAIL ❌"}
              </p>
            </div>
          )}

          {/* SHEAR */}
          {result.shear && (
            <div style={{ marginBottom: "1rem" }}>
              <h3>Shear</h3>
              <p>φVn: {result.shear.phiVn?.toFixed(2)}</p>
              <p>Vu: {result.shear.Vu}</p>
              <p>
                Status:{" "}
                {result.shear.satisfactory ? "PASS ✅" : "FAIL ❌"}
              </p>
            </div>
          )}

          {/* TORSION */}
          {result.torsion && (
            <div style={{ marginBottom: "1rem" }}>
              <h3>Torsion</h3>
              <p>Tu: {result.torsion.Tu}</p>
              <p>{result.torsion.note}</p>
              <p>
                Status:{" "}
                {result.torsion.satisfactory ? "PASS ✅" : "FAIL ❌"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}