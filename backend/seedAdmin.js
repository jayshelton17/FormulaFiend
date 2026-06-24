import bcrypt from "bcrypt";
import { db } from "./db.js";

const seedAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        db.run(
            `INSERT INTO users (username, email, password, role_id)
             VALUES (?, ?, ?, ?)`,
            ["admin", "admin@formulafiend.com", hashedPassword, 2],
            function (err) {
                if (err) {
                    console.log("ERROR:", err.message);
                } else {
                    console.log("✅ Admin created successfully!");
                    console.log("Email: admin@formulafiend.com");
                    console.log("Password: admin123");
                }
            }
        );
    } catch (err) {
        console.error("CRASH:", err);
    }
};

seedAdmin();