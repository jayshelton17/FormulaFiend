import { useState } from 'react';

import './AdminPanel.css';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <main className="admin-page">
      <section className="admin-panel-card">
        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">Admin Workspace</p>
            <h1>Admin Panel</h1>
            <p className="admin-subtitle">
              Manage FormulaFiend users and global engineering formulas.
            </p>
          </div>

        </div>

        <nav className="admin-mini-nav">
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>

          <button
            className={activeTab === 'formulas' ? 'active' : ''}
            onClick={() => setActiveTab('formulas')}
          >
            Formulas
          </button>
        </nav>

        {activeTab === 'users' && (
          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Users</h2>
                <p>View and manage platform users.</p>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                
                <tbody>
                  <tr>
                    <td>John Engineer</td>
                    <td>john@formulafiend.com</td>
                    <td>Admin</td>
                    <td>
                      <span className="status active">Active</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Sarah Designer</td>
                    <td>sarah@formulafiend.com</td>
                    <td>User</td>
                    <td>
                      <span className="status active">Active</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Alex Student</td>
                    <td>alex@student.com</td>
                    <td>User</td>
                    <td>
                      <span className="status inactive">Inactive</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'formulas' && (
          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Formulas</h2>
                <p>Manage global formulas available to users.</p>
              </div>
            </div>

            <div className="formula-admin-list">
              <article className="formula-admin-card">
                <div>
                  <h3>Beam Deflection</h3>
                  <p>Maximum deflection for a simply supported beam.</p>
                </div>
                <span>Active</span>
              </article>

              <article className="formula-admin-card">
                <div>
                  <h3>Concrete Mix Design</h3>
                  <p>Concrete proportioning and material calculation.</p>
                </div>
                <span>Draft</span>
              </article>

              <article className="formula-admin-card">
                <div>
                  <h3>Pipe Flow Rate</h3>
                  <p>Flow rate calculation based on pipe diameter and velocity.</p>
                </div>
                <span>Active</span>
              </article>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}