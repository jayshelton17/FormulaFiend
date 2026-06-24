const BASE_URL = "http://localhost:3000/api";

// AUTH

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const registerUser = async (username, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  return res.json();
};

// USERS

export const getUsers = async (token) => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getUserById = async (token, id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
// PROJECTS

export const getProjects = async (token) => {
  const res = await fetch(`${BASE_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const createProject = async (token, project) => {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

  return res.json();
};

export const getProjectById = async (token, id) => {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

// FORMULAS

// GET ALL FORMULAS (DATABASE STORED)
export const getFormulas = async (token) => {
  const res = await fetch(`${BASE_URL}/formulas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

// ENGINE FORMULAS (REAL CALCULATIONS FROM SERVICES)

export const getEngineFormulas = async (token, inputs) => {
  const endpoints = [
    "flexure",
    "shear",
    "torsion",
    "concrete-beam",
  ];

  const results = await Promise.all(
    endpoints.map(async (type) => {
      const res = await fetch(`${BASE_URL}/calculations/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inputs || {
          fc: 4,
          fy: 60,
          Mu: 200,
          Vu: 20,
          Tu: 0,
          bw: 12,
          h: 24,
          cover: 1.5,
          bottomBars: { bar: "#5", count: 2 },
          topBars: { bar: "#4", count: 2 },
          stirrups: { bar: "#3", legs: 2, spacing: 6 },
        }),
      });

      const data = await res.json();

      return {
        name: type.replace("-", " ").toUpperCase(),
        endpoint: `/calculations/${type}`,
        result: data,
      };
    })
  );

  return results;
};

// CREATE FORMULA
export const createFormula = async (token, formula) => {
  const res = await fetch(`${BASE_URL}/formulas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formula),
  });

  return res.json();
};

// ROLES

export const getRoles = async (token) => {
  const res = await fetch(`${BASE_URL}/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

// CALCULATIONS

export const runCalculation = async (token, endpoint, data) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};