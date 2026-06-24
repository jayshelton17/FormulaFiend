import { db } from "./db.js";

db.all("SELECT * FROM formula", [], (err, rows) => {
  console.log("FORMULAS IN DB:", rows);
});