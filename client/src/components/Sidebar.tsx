import React from "react";
import { NavLink, Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light border-end"
      style={{ width: "280px", height: "100vh" }}
    >
      <Link
        to="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
      >
        <i className="bi bi-smartwatch me-2" style={{ fontSize: "1.5rem" }}></i>
        <span className="fs-4">LivesmartData</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "link-dark"}`
            }
            end
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>

        <li>
          <div className="nav-link text-uppercase small text-muted fw-bold mt-3">
            Leads
          </div>

          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `nav-link ps-4 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-telephone me-2"></i>
            Interested Leads
          </NavLink>
        </li>

        <li>
          <div className="nav-link text-uppercase small text-muted fw-bold mt-3">
            Preview
          </div>

          <div className="nav-link ps-4 small text-muted fw-semibold">
            Philippines
          </div>

          <NavLink
            to="/preview/philippines/manila"
            className={({ isActive }) =>
              `nav-link ps-5 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-geo-alt me-2"></i>
            Manila
          </NavLink>

          <NavLink
            to="/preview/philippines/cebu"
            className={({ isActive }) =>
              `nav-link ps-5 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-geo-alt me-2"></i>
            Cebu
          </NavLink>

          <NavLink
            to="/preview/philippines/davao"
            className={({ isActive }) =>
              `nav-link ps-5 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-geo-alt me-2"></i>
            Davao
          </NavLink>

          <NavLink
            to="/preview/indo"
            className={({ isActive }) =>
              `nav-link ps-4 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-globe-asia-australia me-2"></i>
            Indo
          </NavLink>

          <NavLink
            to="/preview/singapore"
            className={({ isActive }) =>
              `nav-link ps-4 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-globe me-2"></i>
            Singapore
          </NavLink>
        </li>

        <li>
          <div className="nav-link text-uppercase small text-muted fw-bold mt-3">
            Sign Ups
          </div>

          <NavLink
            to="/sign-ups"
            className={({ isActive }) =>
              `nav-link ps-4 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-pencil-square me-2"></i>
            Sign Ups
          </NavLink>
        </li>

        <li>
          <div className="nav-link text-uppercase small text-muted fw-bold mt-3">
            Participants
          </div>

          <NavLink
            to="/participants/camp/may"
            className={({ isActive }) =>
              `nav-link ps-4 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-calendar-event me-2"></i>
            May Camp
          </NavLink>

          <NavLink
            to="/participants/camp/october"
            className={({ isActive }) =>
              `nav-link ps-4 ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-calendar-event me-2"></i>
            October Camp
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-credit-card me-2"></i>
            Payments
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "link-dark"}`
            }
          >
            <i className="bi bi-graph-up me-2"></i>
            Reports
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : "link-dark"}`
          }
        >
          <i className="bi bi-gear me-2"></i>
          Settings
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
