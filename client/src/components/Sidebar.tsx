import React from "react";
import { NavLink, Link } from "react-router-dom";

const getNavClass = ({ isActive }: { isActive: boolean }) =>
  `ls-sidebar-link ${isActive ? "active" : ""}`;

const getSubNavClass = ({ isActive }: { isActive: boolean }) =>
  `ls-sidebar-link ls-sidebar-sub-link ${isActive ? "active" : ""}`;

const getDeepSubNavClass = ({ isActive }: { isActive: boolean }) =>
  `ls-sidebar-link ls-sidebar-deep-link ${isActive ? "active" : ""}`;

const Sidebar: React.FC = () => {
  return (
    <aside className="ls-sidebar">
      <Link to="/" className="ls-brand">
        <div className="ls-brand-icon">
          <i className="bi bi-stars"></i>
        </div>

        <div>
          <div className="ls-brand-title">Livesmart</div>
          <div className="ls-brand-subtitle">Registration System</div>
        </div>
      </Link>

      <div className="ls-sidebar-divider" />

      <nav className="ls-sidebar-nav">
        <NavLink to="/" className={getNavClass} end>
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        <div className="ls-sidebar-section">Leads</div>

        <NavLink to="/leads" className={getSubNavClass}>
          <i className="bi bi-telephone"></i>
          <span>Interested Leads</span>
        </NavLink>

        <div className="ls-sidebar-section">Preview</div>

        <div className="ls-sidebar-country">
          <i className="bi bi-globe-asia-australia"></i>
          <span>Philippines</span>
        </div>
        <NavLink
          to="/preview/philippines/manila"
          className={getDeepSubNavClass}
        >
          <i className="bi bi-geo-alt"></i>
          <span>Manila</span>
        </NavLink>

        <NavLink to="/preview/philippines/cebu" className={getDeepSubNavClass}>
          <i className="bi bi-geo-alt"></i>
          <span>Cebu</span>
        </NavLink>

        <NavLink to="/preview/philippines/davao" className={getDeepSubNavClass}>
          <i className="bi bi-geo-alt"></i>
          <span>Davao</span>
        </NavLink>

        <NavLink to="/preview/indo" className={getSubNavClass}>
          <i className="bi bi-globe-asia-australia"></i>
          <span>Indo</span>
        </NavLink>

        <NavLink to="/preview/singapore" className={getSubNavClass}>
          <i className="bi bi-globe"></i>
          <span>Singapore</span>
        </NavLink>

        <div className="ls-sidebar-section">Sign Ups</div>

        <NavLink to="/sign-ups" className={getSubNavClass}>
          <i className="bi bi-pencil-square"></i>
          <span>Sign Ups</span>
        </NavLink>

        <div className="ls-sidebar-section">Participants</div>

        <NavLink to="/participants/camp/may" className={getSubNavClass}>
          <i className="bi bi-calendar-event"></i>
          <span>May Camp</span>
        </NavLink>

        <NavLink to="/participants/camp/october" className={getSubNavClass}>
          <i className="bi bi-calendar-event"></i>
          <span>October Camp</span>
        </NavLink>

        <div className="ls-sidebar-section">Management</div>

        <NavLink to="/payments" className={getSubNavClass}>
          <i className="bi bi-credit-card"></i>
          <span>Payments</span>
        </NavLink>

        <NavLink to="/reports" className={getSubNavClass}>
          <i className="bi bi-graph-up"></i>
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="ls-sidebar-footer">
        <NavLink to="/settings" className={getNavClass}>
          <i className="bi bi-gear"></i>
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
