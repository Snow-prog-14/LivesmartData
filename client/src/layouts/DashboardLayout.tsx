import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="ls-app-shell">
      <Sidebar />

      <div className="ls-main-shell">
        <Topbar />

        <main className="ls-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
