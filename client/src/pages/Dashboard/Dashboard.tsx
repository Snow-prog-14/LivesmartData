import React, { useMemo } from 'react';
import { getAllParticipants } from '../../utils/participantStorage';
import { 
  getParticipantTotalPaid, 
  getParticipantComputedBalance, 
  getParticipantComputedPaymentStatus,
  getAllPayments
} from '../../utils/paymentSummary';
import { 
  getParticipantComputedConfirmationStatus, 
  getAllConfirmations 
} from '../../utils/confirmationSummary';

const Dashboard: React.FC = () => {
  const participants = getAllParticipants();
  const allPayments = getAllPayments();
  const allConfirmations = getAllConfirmations();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const summary = useMemo(() => {
    let confirmed = 0;
    let pending = 0;
    let notResponding = 0;
    let cancelled = 0;
    let fullyPaid = 0;
    let partial = 0;
    let unpaid = 0;
    let totalCollected = 0;
    let totalBalance = 0;
    let withAllergies = 0;

    participants.forEach(p => {
      const confStatus = getParticipantComputedConfirmationStatus(p);
      const payStatus = getParticipantComputedPaymentStatus(p);
      const paid = getParticipantTotalPaid(p.id);
      const balance = getParticipantComputedBalance(p);

      if (confStatus === 'Confirmed') confirmed++;
      else if (confStatus === 'Pending') pending++;
      else if (confStatus === 'Not Responding') notResponding++;
      else if (confStatus === 'Cancelled') cancelled++;

      if (payStatus === 'Paid') fullyPaid++;
      else if (payStatus === 'Partial') partial++;
      else unpaid++;

      totalCollected += paid;
      totalBalance += balance;

      if (p.hasAllergyNotes || (p.allergyNotes && p.allergyNotes.toLowerCase() !== 'none')) {
        withAllergies++;
      }
    });

    return {
      total: participants.length,
      confirmed,
      pending,
      notResponding,
      cancelled,
      fullyPaid,
      partial,
      unpaid,
      withBalance: partial + unpaid,
      totalCollected,
      totalBalance,
      withAllergies
    };
  }, [participants]);

  const recentPayments = useMemo(() => {
    return [...allPayments]
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(0, 5);
  }, [allPayments]);

  const recentConfirmations = useMemo(() => {
    return [...allConfirmations]
      .sort((a, b) => new Date(b.dateConfirmation).getTime() - new Date(a.dateConfirmation).getTime())
      .slice(0, 5);
  }, [allConfirmations]);

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="mb-1">Dashboard</h2>
        <p className="text-muted">Real-time overview of participant registrations and payments.</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted small uppercase">Total Participants</h6>
              <h3 className="card-title mb-0">{summary.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75 small uppercase">Confirmed</h6>
              <h3 className="card-title mb-0">{summary.confirmed}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-warning text-dark">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75 small uppercase">Pending</h6>
              <h3 className="card-title mb-0">{summary.pending}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-danger text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75 small uppercase">Not Responding</h6>
              <h3 className="card-title mb-0">{summary.notResponding}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted small uppercase">Fully Paid</h6>
              <h3 className="card-title mb-0 text-success">{summary.fullyPaid}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted small uppercase">With Balance</h6>
              <h3 className="card-title mb-0 text-danger">{summary.withBalance}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted small uppercase">Total Collected</h6>
              <h4 className="card-title mb-0 text-primary">{formatCurrency(summary.totalCollected)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted small uppercase">Total Balance</h6>
              <h4 className="card-title mb-0 text-secondary">{formatCurrency(summary.totalBalance)}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Payment Overview */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="card-title mb-0">Payment Overview</h5>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="row g-3 text-center">
                <div className="col-4 border-end">
                  <div className="p-2">
                    <div className="text-success fs-4 fw-bold">{summary.fullyPaid}</div>
                    <div className="small text-muted">Paid</div>
                  </div>
                </div>
                <div className="col-4 border-end">
                  <div className="p-2">
                    <div className="text-warning fs-4 fw-bold">{summary.partial}</div>
                    <div className="small text-muted">Partial</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2">
                    <div className="text-danger fs-4 fw-bold">{summary.unpaid}</div>
                    <div className="small text-muted">Unpaid</div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Collected:</span>
                <span className="fw-bold text-primary">{formatCurrency(summary.totalCollected)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Outstanding Balance:</span>
                <span className="fw-bold text-danger">{formatCurrency(summary.totalBalance)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Overview */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="card-title mb-0">Confirmation Overview</h5>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="row g-3 text-center">
                <div className="col-3 border-end">
                  <div className="p-2">
                    <div className="text-primary fs-4 fw-bold">{summary.confirmed}</div>
                    <div className="small text-muted">Confirmed</div>
                  </div>
                </div>
                <div className="col-3 border-end">
                  <div className="p-2">
                    <div className="text-warning fs-4 fw-bold">{summary.pending}</div>
                    <div className="small text-muted">Pending</div>
                  </div>
                </div>
                <div className="col-3 border-end">
                  <div className="p-2">
                    <div className="text-danger fs-4 fw-bold">{summary.notResponding}</div>
                    <div className="small text-muted">Not Responding</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2">
                    <div className="text-secondary fs-4 fw-bold">{summary.cancelled}</div>
                    <div className="small text-muted">Cancelled</div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-info-circle text-info fs-5 me-2"></i>
                </div>
                <div className="flex-grow-1">
                  <span className="small text-muted">
                    {summary.withAllergies} participants have allergy notes that require attention.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Payments Table */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Payments</h5>
              <i className="bi bi-currency-dollar text-primary"></i>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4">Participant</th>
                      <th>Receipt No.</th>
                      <th className="text-end">Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.length > 0 ? (
                      recentPayments.map(p => (
                        <tr key={p.id}>
                          <td className="px-4">{p.participantName}</td>
                          <td><code className="text-muted">{p.receiptNo}</code></td>
                          <td className="text-end fw-bold">{formatCurrency(p.amount)}</td>
                          <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">No recent payments.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Confirmations Table */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Confirmations</h5>
              <i className="bi bi-telephone text-primary"></i>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4">Participant</th>
                      <th>Status</th>
                      <th>Via</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentConfirmations.length > 0 ? (
                      recentConfirmations.map(c => (
                        <tr key={c.id}>
                          <td className="px-4">{c.participantName}</td>
                          <td>
                            <span className={`badge ${
                              c.confirmationStatus === 'Confirmed' ? 'bg-success-subtle text-success' : 
                              c.confirmationStatus === 'Pending' ? 'bg-warning-subtle text-warning' : 
                              'bg-danger-subtle text-danger'
                            }`}>
                              {c.confirmationStatus}
                            </span>
                          </td>
                          <td>{c.confirmVia}</td>
                          <td>{new Date(c.dateConfirmation).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">No recent confirmations.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
