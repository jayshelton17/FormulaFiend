# FormulaFiend

A full-stack engineering calculation platform designed to simplify structural engineering workflows by providing users with project management, formula storage, and calculation tools.

FormulaFiend allows engineers and students to organize structural design projects, access engineering formulas, and perform calculations through a modern web application.

---

## 🚀 Features

- User authentication and authorization
- Secure account creation and login
- Role-based access control
- Create and manage engineering projects
- Store and organize structural calculations
- Formula management system
- Protected routes and user-specific data
- Responsive web interface
- REST API backend architecture

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- SQLite

### Authentication
- JSON Web Tokens (JWT)
- bcrypt password hashing

---

## 📂 Project Structure
FormulaFiend/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── api/
│
├── backend/
│ ├── routes/
│ ├── middleware/
│ ├── database/
│ └── server.js
│
└── README.md
└── .gitignor

---

## 🗄️ Database Design

FormulaFiend uses SQLite with a relational structure:

### Users
Stores account information.

Fields:
- id
- username
- email
- password
- role_id

### Roles
Controls user permissions.

Fields:
- id
- name
- permissions

### Projects
Stores user-created engineering projects.

Fields:
- id
- name
- formula_id

### Formulas
Stores calculation templates.

Fields:
- id
- name
- calculation
- user_id

---

## 🔐 Authentication Flow

1. User registers an account
2. Password is securely hashed
3. User credentials are stored in the database
4. Login returns a JWT token
5. Protected routes verify authentication before allowing access

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/jayshelton17/FormulaFiend.git

cd FormulaFiend

## 📦 Installing Dependencies

This project uses npm for package management.

### Backend

```bash
cd backend
npm install

### Frontend

```bash
cd frontend
npm install