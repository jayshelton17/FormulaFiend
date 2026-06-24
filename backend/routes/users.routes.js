import express from "express";
import { db } from "../db.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET ALL USERS (protected)
router.get("/", authenticate, (req, res) => {
    db.all("SELECT id, username, email, role_id FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET USER BY ID
router.get("/:id", authenticate, (req, res) => {
    db.get(
        "SELECT id, username, email, role_id FROM users WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        }
    );
});

// DELETE USER
router.delete("/:id", authenticate, (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ deleted: this.changes });
    });
});

export default router;