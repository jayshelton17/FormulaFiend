import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./formulafiend.db");

export function initDatabase() {
    db.serialize(() => {

        // ROLES TABLE
        db.run(`
            CREATE TABLE IF NOT EXISTS roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                permissions TEXT NOT NULL
            )
        `);

        // USERS TABLE
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                role_id INTEGER,
                FOREIGN KEY (role_id) REFERENCES roles(id)
            )
        `);

        // PROJECTS TABLE
        db.run(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                formula_id TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // FORMULAS TABLE
        db.run(`
            CREATE TABLE IF NOT EXISTS formula (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                calculation TEXT NOT NULL,
                user_id INTEGER
            )
        `);
    });
}