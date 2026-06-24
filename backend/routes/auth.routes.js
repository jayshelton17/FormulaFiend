import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

/**
 * REGISTER USER (SAFE)
 */
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (username, email, password, role_id)
            VALUES (?, ?, ?, ?)
        `;

        // DEFAULT = USER (NEVER allow client to set admin)
        const defaultRole = 1;

        db.run(sql, [username, email, hashedPassword, defaultRole], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                id: this.lastID,
                username,
                email,
                role_id: defaultRole
            });
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * LOGIN USER (FULLY SAFE)
 */
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.get(sql, [email], async (err, user) => {
        if (err) {
            console.error("DB ERROR:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        try {
            // SAFE CHECK: ensure password exists
            if (!user.password) {
                return res.status(500).json({ error: "User password missing in DB" });
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return res.status(401).json({ error: "Invalid password" });
            }

            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ error: "JWT_SECRET not set in .env" });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role_id === 1 ? "user" : "admin"
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role_id === 1 ? "user" : "admin"
                }
            });

        } catch (e) {
            console.error("LOGIN CRASH:", e);
            return res.status(500).json({ error: e.message });
        }
    });
});

export default router;