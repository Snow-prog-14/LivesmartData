import React from "react";
import { Link } from "react-router-dom";

const Topbar: React.FC = () => {
  return (
    <header className="ls-topbar">
      <div className="ls-topbar-search">
        <i className="bi bi-search"></i>
        <input type="search" placeholder="Search records..." />
      </div>

      <div className="ls-topbar-actions">
        <Link className="ls-icon-button position-relative" to="#">
          <i className="bi bi-bell"></i>
          <span className="ls-notification-badge">3</span>
        </Link>

        <div className="ls-admin-pill">
          <div className="ls-admin-avatar">AD</div>

          <div className="d-none d-md-block">
            <div className="ls-admin-name">Admin</div>
            <div className="ls-admin-role">Livesmart Team</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
