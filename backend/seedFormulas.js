import { db } from "./db.js";

const formulas = [
  ["Axial Load", "P = A * stress", 1],
  ["Bending Stress", "σ = Mc/I", 1],
  ["Shear Stress", "τ = VQ/It", 1]
];

formulas.forEach((f) => {
  db.run(
    "INSERT INTO formula (name, calculation, user_id) VALUES (?, ?, ?)",
    f
  );
});

console.log("Seeded formulas!");