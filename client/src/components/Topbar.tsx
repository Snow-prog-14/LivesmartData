import React from 'react';
import { Link } from 'react-router-dom';

const Topbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex me-auto">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input className="form-control bg-light border-start-0" type="search" placeholder="Search..." aria-label="Search" />
            </div>
          </form>
          <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
            <li className="nav-item me-3">
              <Link className="nav-link position-relative" to="#">
                <i className="bi bi-bell fs-5"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                  AD
                </div>
                <span>Admin</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
