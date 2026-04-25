import React, { useState } from 'react';
import { mockParticipants, Participant } from '../../mock/participants';

const Participants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [confirmationFilter, setConfirmationFilter] = useState('');

  // Filtering logic
  const filteredParticipants = mockParticipants.filter((p) => {
    const matchesSearch = p.participantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = programFilter === '' || p.program === programFilter;
    const matchesPayment = paymentFilter === '' || p.paymentStatus === paymentFilter;
    const matchesConfirmation = confirmationFilter === '' || p.confirmationStatus === confirmationFilter;

    return matchesSearch && matchesProgram && matchesPayment && matchesConfirmation;
  });

  const getPaymentBadgeClass = (status: Participant['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'bg-success';
      case 'Partial': return 'bg-warning text-dark';
      case 'Unpaid': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getConfirmationBadgeClass = (status: Participant['confirmationStatus']) => {
    switch (status) {
      case 'Confirmed': return 'bg-success';
      case 'Pending': return 'bg-warning text-dark';
      case 'Not Responding': return 'bg-danger';
      case 'Cancelled': return 'bg-secondary';
      default: return 'bg-info';
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Participants</h2>
        <p className="text-muted">Manage and view all registered participants for current programs.</p>
      </div>

      {/* Filters Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold">Search</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name or receipt..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold">Program</label>
              <select 
                className="form-select" 
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="">All Programs</option>
                <option value="Youth Leadership">Youth Leadership</option>
                <option value="Creative Writing">Creative Writing</option>
                <option value="Science Exploration">Science Exploration</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Payment Status</label>
              <select 
                className="form-select"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Confirmation</label>
              <select 
                className="form-select"
                value={confirmationFilter}
                onChange={(e) => setConfirmationFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Not Responding">Not Responding</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Receipt No.</th>
                  <th>Participant Name</th>
                  <th>Program</th>
                  <th>Intake</th>
                  <th>City of Camp</th>
                  <th>Contact</th>
                  <th>Payment Status</th>
                  <th>Balance</th>
                  <th>Confirmation</th>
                  <th>Call Status</th>
                  <th className="pe-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4 fw-medium text-primary">{p.receiptNo}</td>
                      <td>
                        <div className="fw-bold">{p.participantName}</div>
                        <small className="text-muted">{p.nickname}</small>
                        {p.hasAllergyNotes && (
                          <span className="ms-2 badge bg-info-subtle text-info rounded-pill" style={{ fontSize: '0.65rem' }}>
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>Allergy
                          </span>
                        )}
                      </td>
                      <td>{p.program}</td>
                      <td>{p.intake}</td>
                      <td>{p.cityOfCamp}</td>
                      <td>
                        <div className="small">{p.participantNumber}</div>
                        <div className="small text-muted">{p.participantEmail}</div>
                      </td>
                      <td>
                        <span className={`badge ${getPaymentBadgeClass(p.paymentStatus)}`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="fw-bold text-danger">
                        {p.balance > 0 ? `$${p.balance}` : '-'}
                      </td>
                      <td>
                        <span className={`badge ${getConfirmationBadgeClass(p.confirmationStatus)}`}>
                          {p.confirmationStatus}
                        </span>
                      </td>
                      <td className="small">{p.callStatus}</td>
                      <td className="pe-4 text-center">
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-secondary" title="View">
                            View
                          </button>
                          <button className="btn btn-sm btn-outline-primary" title="Edit">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-5 text-muted">
                      No participants found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;
