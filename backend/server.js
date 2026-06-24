import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import roleRoutes from "./routes/roles.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import formulaRoutes from "./routes/formulas.routes.js";
import calculationRoutes from "./routes/calculations.routes.js";

import { initDatabase } from "./db.js";

dotenv.config();
initDatabase();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/formulas", formulaRoutes);
app.use("/api/calculations", calculationRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        message: "FormulaFiend API is running 🚀"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});