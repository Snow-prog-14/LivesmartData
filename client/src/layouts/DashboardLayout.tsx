import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Topbar />
        <main className="p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
