import express from "express";
import { db } from "../db.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =========================
   ENGINE FORMULAS (STATIC UI)
   IMPORTANT: MUST BE ABOVE /:id
========================= */
router.get("/engine", (req, res) => {
    return res.json([
        {
            name: "Flexure",
            endpoint: "/calculations/flexure",
            material: ["concrete", "steel"]
        },
        {
            name: "Shear",
            endpoint: "/calculations/shear",
            material: ["concrete", "steel"]
        },
        {
            name: "Torsion",
            endpoint: "/calculations/torsion",
            material: ["steel"]
        },
        {
            name: "Concrete Beam",
            endpoint: "/calculations/concrete-beam",
            material: ["concrete"]
        }
    ]);
});

/* =========================
   CREATE FORMULA (DB)
========================= */
router.post("/", authenticate, (req, res) => {
    const { name, calculation, user_id } = req.body;

    db.run(
        "INSERT INTO formula (name, calculation, user_id) VALUES (?, ?, ?)",
        [name, calculation, user_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                id: this.lastID,
                name,
                calculation,
                user_id
            });
        }
    );
});

/* =========================
   GET ALL FORMULAS (DB)
========================= */
router.get("/", authenticate, (req, res) => {
    db.all("SELECT * FROM formula", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/* =========================
   GET FORMULA BY ID
   (MUST BE BELOW /engine)
========================= */
router.get("/:id", authenticate, (req, res) => {
    db.get(
        "SELECT * FROM formula WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        }
    );
});

/* =========================
   DELETE FORMULA
========================= */
router.delete("/:id", authenticate, (req, res) => {
    db.run(
        "DELETE FROM formula WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ deleted: this.changes });
        }
    );
});

export default router;