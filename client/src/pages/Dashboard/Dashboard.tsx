import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <i className="bi bi-people text-primary fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0">Total Participants</h6>
                <h4 className="mb-0">1,234</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <i className="bi bi-clipboard-check text-success fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0">Active Registrations</h6>
                <h4 className="mb-0">567</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                <i className="bi bi-currency-dollar text-info fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0">Total Payments</h6>
                <h4 className="mb-0">$45,678</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                <i className="bi bi-exclamation-triangle text-warning fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0">Pending Tasks</h6>
                <h4 className="mb-0">12</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
