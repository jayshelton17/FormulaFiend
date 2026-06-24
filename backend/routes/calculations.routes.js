import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import { runFlexure } from "../services/formulas/flexure.js";
import { runShear } from "../services/formulas/shear.js";
import { runTorsion } from "../services/formulas/torsion.js";
import { runConcreteBeam } from "../services/formulas/concreteBeam.js";

const router = express.Router();

/* =========================
   FLEXURE
========================= */
router.post("/flexure", authenticate, (req, res) => {
  try {
    const result = runFlexure(req.body);

    res.json({
      inputs: result.inputs,
      summary: {
        overallSatisfactory: result.outputs.satisfactory,
      },
      flexure: {
        ...result.outputs,
        ...result.derived,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================
   SHEAR
========================= */
router.post("/shear", authenticate, (req, res) => {
  try {
    const result = runShear(req.body);

    res.json({
      inputs: result.inputs,
      summary: {
        overallSatisfactory: result.outputs.satisfactory,
      },
      shear: {
        ...result.outputs,
        ...result.derived,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================
   TORSION
========================= */
router.post("/torsion", authenticate, (req, res) => {
  try {
    const result = runTorsion(req.body);

    res.json({
      inputs: result.inputs,
      summary: {
        overallSatisfactory: result.outputs.satisfactory,
      },
      torsion: {
        ...result.outputs,
        ...result.derived,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/concrete-beam", authenticate, (req, res) => {
  try {
    const result = runConcreteBeam(req.body);

    res.json({
      inputs: result.inputs,
      summary: result.summary,
      flexure: result.flexure,
      shear: result.shear,
      torsion: result.torsion,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;