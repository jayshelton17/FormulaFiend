import express from "express";
import { db } from "../db.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// CREATE PROJECT (USER-SPECIFIC)
router.post("/", authenticate, (req, res) => {
    const { name, formula_id } = req.body;
    const user_id = req.user.id;

    db.run(
        "INSERT INTO projects (name, formula_id, user_id) VALUES (?, ?, ?)",
        [name, formula_id, user_id],
        function (err) {
            if (err) {
                console.error("CREATE PROJECT ERROR:", err.message);
                return res.status(500).json({ error: err.message });
            }

            res.json({
                id: this.lastID,
                name,
                formula_id,
                user_id
            });
        }
    );
});

// GET PROJECTS (ONLY USER'S)
router.get("/", authenticate, (req, res) => {
    const user_id = req.user.id;

    db.all(
        "SELECT * FROM projects WHERE user_id = ?",
        [user_id],
        (err, rows) => {
            if (err) {
                console.error("GET PROJECTS ERROR:", err.message);
                return res.status(500).json({ error: err.message });
            }

            res.json(rows);
        }
    );
});

// GET PROJECT BY ID (SECURE)
router.get("/:id", authenticate, (req, res) => {
    const user_id = req.user.id;

    db.get(
        "SELECT * FROM projects WHERE id = ? AND user_id = ?",
        [req.params.id, user_id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(403).json({ error: "Not authorized" });
            }

            res.json(row);
        }
    );
});

// DELETE PROJECT (SECURE)
router.delete("/:id", authenticate, (req, res) => {
    const user_id = req.user.id;

    db.run(
        "DELETE FROM projects WHERE id = ? AND user_id = ?",
        [req.params.id, user_id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(403).json({ error: "Not authorized" });
            }

            res.json({ deleted: this.changes });
        }
    );
});

export default router;