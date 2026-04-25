import React, { useState, useEffect, useMemo } from 'react';
import { mockPayments } from '../../mock/payments';
import type { Payment, PaymentMode } from '../../mock/payments';
import { mockParticipants } from '../../mock/participants';
import type { Participant } from '../../mock/participants';

const Payments: React.FC = () => {
  // States
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<'All' | PaymentMode>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const initialFormState = {
    participantId: '',
    paymentNumber: '',
    amount: '',
    modeOfPayment: 'Cash' as PaymentMode,
    paymentDate: new Date().toISOString().split('T')[0],
    trackingNumber: '',
    remarks: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load and merge data
  const loadData = () => {
    // Load Participants (for dropdown)
    let mergedParticipants = [...mockParticipants];
    const localSavedParticipants = localStorage.getItem('livesmart_participants');
    if (localSavedParticipants) {
      try {
        const localParts: Participant[] = JSON.parse(localSavedParticipants);
        localParts.forEach(lp => {
          const idx = mergedParticipants.findIndex(mp => mp.id === lp.id);
          if (idx !== -1) mergedParticipants[idx] = lp;
          else mergedParticipants.push(lp);
        });
      } catch (e) { console.error(e); }
    }
    const deletedPartIdsRaw = localStorage.getItem('livesmart_deleted_participant_ids');
    if (deletedPartIdsRaw) {
      try {
        const deletedIds: string[] = JSON.parse(deletedPartIdsRaw);
        mergedParticipants = mergedParticipants.filter(p => !deletedIds.includes(p.id));
      } catch (e) { console.error(e); }
    }
    setParticipants(mergedParticipants);

    // Load Payments
    let mergedPayments = [...mockPayments];
    const localSavedPayments = localStorage.getItem('livesmart_payments');
    if (localSavedPayments) {
      try {
        const localPays: Payment[] = JSON.parse(localSavedPayments);
        localPays.forEach(lp => {
          const idx = mergedPayments.findIndex(mp => mp.id === lp.id);
          if (idx !== -1) mergedPayments[idx] = lp;
          else mergedPayments.push(lp);
        });
      } catch (e) { console.error(e); }
    }
    const deletedPayIdsRaw = localStorage.getItem('livesmart_deleted_payment_ids');
    if (deletedPayIdsRaw) {
      try {
        const deletedIds: string[] = JSON.parse(deletedPayIdsRaw);
        mergedPayments = mergedPayments.filter(p => !deletedIds.includes(p.id));
      } catch (e) { console.error(e); }
    }
    setAllPayments(mergedPayments);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return allPayments.filter(p => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        p.participantName.toLowerCase().includes(search) ||
        p.receiptNo.toLowerCase().includes(search) ||
        p.trackingNumber.toLowerCase().includes(search) ||
        p.modeOfPayment.toLowerCase().includes(search);
      
      const matchesMode = modeFilter === 'All' || p.modeOfPayment === modeFilter;
      
      return matchesSearch && matchesMode;
    });
  }, [allPayments, searchTerm, modeFilter]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.participantId) newErrors.participantId = 'Participant is required';
    if (!formData.paymentNumber) newErrors.paymentNumber = 'Payment Number is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.modeOfPayment) newErrors.modeOfPayment = 'Mode is required';
    if (!formData.paymentDate) newErrors.paymentDate = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedParticipant = participants.find(p => p.id === formData.participantId);
    
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      participantId: formData.participantId,
      participantName: selectedParticipant?.participantName || 'Unknown',
      receiptNo: selectedParticipant?.receiptNo || 'N/A',
      paymentNumber: formData.paymentNumber,
      amount: parseFloat(formData.amount),
      modeOfPayment: formData.modeOfPayment as PaymentMode,
      paymentDate: formData.paymentDate,
      trackingNumber: formData.trackingNumber || 'N/A',
      remarks: formData.remarks
    };

    const saved = localStorage.getItem('livesmart_payments');
    const localPays: Payment[] = saved ? JSON.parse(saved) : [];
    localPays.push(newPayment);
    localStorage.setItem('livesmart_payments', JSON.stringify(localPays));

    setFormData(initialFormState);
    setShowAddForm(false);
    loadData();
    alert('Payment added successfully!');
  };

  const handleDelete = (id: string, payNo: string) => {
    if (window.confirm(`Are you sure you want to delete payment ${payNo}?`)) {
      // Add to deleted IDs (for mock/local hiding)
      const deletedRaw = localStorage.getItem('livesmart_deleted_payment_ids');
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('livesmart_deleted_payment_ids', JSON.stringify(deletedIds));
      }

      // Also remove from livesmart_payments if it exists there
      const saved = localStorage.getItem('livesmart_payments');
      if (saved) {
        const localPays: Payment[] = JSON.parse(saved);
        const updated = localPays.filter(p => p.id !== id);
        localStorage.setItem('livesmart_payments', JSON.stringify(updated));
      }

      loadData();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">Payments</h1>
          <p className="text-muted mb-0">Track and manage participant payment transactions.</p>
        </div>
        <button 
          className={`btn ${showAddForm ? 'btn-outline-secondary' : 'btn-primary'}`}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Payment'}
        </button>
      </div>

      {showAddForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold text-primary">New Payment Entry</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Select Participant *</label>
                <select 
                  name="participantId"
                  className={`form-select ${errors.participantId ? 'is-invalid' : ''}`}
                  value={formData.participantId}
                  onChange={handleInputChange}
                >
                  <option value="">Choose...</option>
                  {participants.map(p => (
                    <option key={p.id} value={p.id}>{p.participantName} ({p.receiptNo})</option>
                  ))}
                </select>
                {errors.participantId && <div className="invalid-feedback">{errors.participantId}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Payment No. *</label>
                <input 
                  type="text" 
                  name="paymentNumber"
                  className={`form-control ${errors.paymentNumber ? 'is-invalid' : ''}`}
                  value={formData.paymentNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. PMT-100"
                />
                {errors.paymentNumber && <div className="invalid-feedback">{errors.paymentNumber}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Amount *</label>
                <div className="input-group">
                  <span className="input-group-text">₱</span>
                  <input 
                    type="number" 
                    name="amount"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                  {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Mode of Payment *</label>
                <select 
                  name="modeOfPayment"
                  className="form-select"
                  value={formData.modeOfPayment}
                  onChange={handleInputChange}
                >
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Payment Date *</label>
                <input 
                  type="date" 
                  name="paymentDate"
                  className="form-control"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Tracking / Reference No.</label>
                <input 
                  type="text" 
                  name="trackingNumber"
                  className="form-control"
                  value={formData.trackingNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">Remarks</label>
                <textarea 
                  name="remarks"
                  className="form-control" 
                  rows={2}
                  value={formData.remarks}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary px-4">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Search by name, receipt, tracking or mode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value as any)}
              >
                <option value="All">All Payment Modes</option>
                <option value="Cash">Cash</option>
                <option value="GCash">GCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Payment No.</th>
                  <th>Participant</th>
                  <th>Receipt No.</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Tracking No.</th>
                  <th>Remarks</th>
                  <th className="text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map(p => (
                    <tr key={p.id}>
                      <td className="ps-4 fw-bold">{p.paymentNumber}</td>
                      <td>{p.participantName}</td>
                      <td><code>{p.receiptNo}</code></td>
                      <td className="fw-bold text-success">{formatCurrency(p.amount)}</td>
                      <td>
                        <span className="badge bg-info-subtle text-info-emphasis">
                          {p.modeOfPayment}
                        </span>
                      </td>
                      <td>{p.paymentDate}</td>
                      <td><small className="text-muted">{p.trackingNumber}</small></td>
                      <td><small className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>{p.remarks}</small></td>
                      <td className="text-center pe-4">
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(p.id, p.paymentNumber)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-5 text-muted">No payments found.</td>
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

export default Payments;
