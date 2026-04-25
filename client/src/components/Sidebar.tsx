import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light border-end" style={{ width: '280px', height: '100vh' }}>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <i className="bi bi-smartwatch me-2" style={{ fontSize: '1.5rem' }}></i>
        <span className="fs-4">LivesmartData</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'link-dark'}`} end>
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/participants" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'link-dark'}`}>
            <i className="bi bi-people me-2"></i>
            Participants
          </NavLink>
        </li>
        <li>
          <NavLink to="/registration" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'link-dark'}`}>
            <i className="bi bi-clipboard-check me-2"></i>
            Registration
          </NavLink>
        </li>
        <li>
          <NavLink to="/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'link-dark'}`}>
            <i className="bi bi-credit-card me-2"></i>
            Payments
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'link-dark'}`}>
            <i className="bi bi-graph-up me-2"></i>
            Reports
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'link-dark'}`}>
          <i className="bi bi-gear me-2"></i>
          Settings
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
