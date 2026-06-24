import express from "express";
import { db } from "../db.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// CREATE ROLE
router.post("/", authenticate, (req, res) => {
    const { name, permissions } = req.body;

    db.run(
        "INSERT INTO roles (name, permissions) VALUES (?, ?)",
        [name, permissions],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ id: this.lastID, name, permissions });
        }
    );
});

// GET ALL ROLES
router.get("/", authenticate, (req, res) => {
    db.all("SELECT * FROM roles", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

export default router;