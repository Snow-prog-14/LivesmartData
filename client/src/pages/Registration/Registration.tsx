import React, { useState, useEffect } from 'react';
import type { ConfirmationRecord, ConfirmationStatus, ConfirmVia } from '../../mock/confirmations';
import type { ContactLog, ContactChannel } from '../../mock/contactLogs';
import type { Participant } from '../../mock/participants';
import { getAllParticipants } from '../../utils/participantStorage';
import { getAllConfirmations } from '../../utils/confirmationSummary';
import { getAllContactLogs } from '../../utils/contactLogSummary';

const Registration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'confirmations' | 'contactLogs'>('confirmations');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [confirmations, setConfirmations] = useState<ConfirmationRecord[]>([]);
  const [contactLogs, setContactLogs] = useState<ContactLog[]>([]);

  // Search and Filter States
  const [confSearch, setConfSearch] = useState('');
  const [confStatusFilter, setConfStatusFilter] = useState<string>('All');
  const [confViaFilter, setConfViaFilter] = useState<string>('All');

  const [logSearch, setLogSearch] = useState('');
  const [logChannelFilter, setLogChannelFilter] = useState<string>('All');

  // Form States
  const [showConfModal, setShowConfModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  const [confForm, setConfForm] = useState({
    participantId: '',
    confirmationPeriod: '',
    confirmationStatus: 'Pending' as ConfirmationStatus,
    finalConfirmation: 'No',
    dateConfirmation: new Date().toISOString().split('T')[0],
    confirmVia: 'Call' as ConfirmVia,
    callStatus: '',
    response: '',
    remarks: ''
  });

  const [logForm, setLogForm] = useState({
    participantId: '',
    messageType: '',
    channel: 'Call' as ContactChannel,
    dateSent: new Date().toISOString().split('T')[0],
    response: '',
    callStatus: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setParticipants(getAllParticipants());
    setConfirmations(getAllConfirmations());
    setContactLogs(getAllContactLogs());
  };

  const handleAddConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confForm.participantId || !confForm.confirmationPeriod || !confForm.confirmationStatus || !confForm.dateConfirmation || !confForm.confirmVia) {
      alert('Please fill in all required fields');
      return;
    }

    const participant = participants.find(p => p.id === confForm.participantId);
    if (!participant) return;

    const newRecord: ConfirmationRecord = {
      ...confForm,
      id: `C-${Date.now()}`,
      participantName: participant.participantName,
      receiptNo: participant.receiptNo
    };

    const localConfJson = localStorage.getItem('livesmart_confirmations');
    const localConf: ConfirmationRecord[] = localConfJson ? JSON.parse(localConfJson) : [];
    localStorage.setItem('livesmart_confirmations', JSON.stringify([...localConf, newRecord]));

    setShowConfModal(false);
    setConfForm({
      participantId: '',
      confirmationPeriod: '',
      confirmationStatus: 'Pending',
      finalConfirmation: 'No',
      dateConfirmation: new Date().toISOString().split('T')[0],
      confirmVia: 'Call',
      callStatus: '',
      response: '',
      remarks: ''
    });
    loadData();
  };

  const handleDeleteConfirmation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this confirmation record?')) {
      if (id.startsWith('C-00')) {
        // Mock ID
        const deletedIdsJson = localStorage.getItem('livesmart_deleted_confirmation_ids');
        const deletedIds: string[] = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
        localStorage.setItem('livesmart_deleted_confirmation_ids', JSON.stringify([...deletedIds, id]));
      } else {
        // Local ID
        const localConfJson = localStorage.getItem('livesmart_confirmations');
        const localConf: ConfirmationRecord[] = localConfJson ? JSON.parse(localConfJson) : [];
        localStorage.setItem('livesmart_confirmations', JSON.stringify(localConf.filter(c => c.id !== id)));
      }
      loadData();
    }
  };

  const handleAddContactLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.participantId || !logForm.messageType || !logForm.channel || !logForm.dateSent) {
      alert('Please fill in all required fields');
      return;
    }

    const participant = participants.find(p => p.id === logForm.participantId);
    if (!participant) return;

    const newLog: ContactLog = {
      ...logForm,
      id: `L-${Date.now()}`,
      participantName: participant.participantName,
      receiptNo: participant.receiptNo
    };

    const localLogsJson = localStorage.getItem('livesmart_contact_logs');
    const localLogs: ContactLog[] = localLogsJson ? JSON.parse(localLogsJson) : [];
    localStorage.setItem('livesmart_contact_logs', JSON.stringify([...localLogs, newLog]));

    setShowLogModal(false);
    setLogForm({
      participantId: '',
      messageType: '',
      channel: 'Call',
      dateSent: new Date().toISOString().split('T')[0],
      response: '',
      callStatus: '',
      notes: ''
    });
    loadData();
  };

  const handleDeleteContactLog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact log?')) {
      if (id.startsWith('L-00')) {
        // Mock ID
        const deletedIdsJson = localStorage.getItem('livesmart_deleted_contact_log_ids');
        const deletedIds: string[] = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
        localStorage.setItem('livesmart_deleted_contact_log_ids', JSON.stringify([...deletedIds, id]));
      } else {
        // Local ID
        const localLogsJson = localStorage.getItem('livesmart_contact_logs');
        const localLogs: ContactLog[] = localLogsJson ? JSON.parse(localLogsJson) : [];
        localStorage.setItem('livesmart_contact_logs', JSON.stringify(localLogs.filter(l => l.id !== id)));
      }
      loadData();
    }
  };

  const filteredConfirmations = confirmations.filter(c => {
    const matchesSearch = c.participantName.toLowerCase().includes(confSearch.toLowerCase()) || 
                         c.receiptNo.toLowerCase().includes(confSearch.toLowerCase());
    const matchesStatus = confStatusFilter === 'All' || c.confirmationStatus === confStatusFilter;
    const matchesVia = confViaFilter === 'All' || c.confirmVia === confViaFilter;
    return matchesSearch && matchesStatus && matchesVia;
  });

  const filteredContactLogs = contactLogs.filter(l => {
    const matchesSearch = l.participantName.toLowerCase().includes(logSearch.toLowerCase()) || 
                         l.receiptNo.toLowerCase().includes(logSearch.toLowerCase());
    const matchesChannel = logChannelFilter === 'All' || l.channel === logChannelFilter;
    return matchesSearch && matchesChannel;
  });

  const getStatusBadge = (status: ConfirmationStatus) => {
    switch (status) {
      case 'Confirmed': return 'bg-success';
      case 'Pending': return 'bg-warning text-dark';
      case 'Not Responding': return 'bg-info text-dark';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Confirmations</h2>
          <p className="text-muted">Manage participant confirmations and contact history.</p>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4" id="regTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'confirmations' ? 'active' : ''}`} 
            onClick={() => setActiveTab('confirmations')}
          >
            Confirmation Records
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'contactLogs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('contactLogs')}
          >
            Contact Logs
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Confirmation Records Section */}
        {activeTab === 'confirmations' && (
          <div className="card border-0 shadow-sm p-4">
            <div className="row g-3 mb-4 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-bold">Search</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search name or receipt..." 
                  value={confSearch}
                  onChange={(e) => setConfSearch(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">Status</label>
                <select 
                  className="form-select" 
                  value={confStatusFilter}
                  onChange={(e) => setConfStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Responding">Not Responding</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">Confirm Via</label>
                <select 
                  className="form-select" 
                  value={confViaFilter}
                  onChange={(e) => setConfViaFilter(e.target.value)}
                >
                  <option value="All">All Channels</option>
                  <option value="Call">Call</option>
                  <option value="SMS">SMS</option>
                  <option value="Viber">Viber</option>
                  <option value="Email">Email</option>
                  <option value="In Person">In Person</option>
                </select>
              </div>
              <div className="col-md-4 text-md-end">
                <button className="btn btn-primary" onClick={() => setShowConfModal(true)}>
                  <i className="bi bi-plus-lg me-2"></i>Add Confirmation
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Participant</th>
                    <th>Receipt No.</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Final</th>
                    <th>Date</th>
                    <th>Via</th>
                    <th>Call Status</th>
                    <th>Response</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConfirmations.map(c => (
                    <tr key={c.id}>
                      <td><div className="fw-bold">{c.participantName}</div></td>
                      <td><code>{c.receiptNo}</code></td>
                      <td>{c.confirmationPeriod}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(c.confirmationStatus)}`}>
                          {c.confirmationStatus}
                        </span>
                      </td>
                      <td>{c.finalConfirmation}</td>
                      <td>{c.dateConfirmation}</td>
                      <td>{c.confirmVia}</td>
                      <td>{c.callStatus}</td>
                      <td>{c.response}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteConfirmation(c.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredConfirmations.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-4 text-muted">No confirmation records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contact Logs Section */}
        {activeTab === 'contactLogs' && (
          <div className="card border-0 shadow-sm p-4">
            <div className="row g-3 mb-4 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-bold">Search</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search name or receipt..." 
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Channel</label>
                <select 
                  className="form-select" 
                  value={logChannelFilter}
                  onChange={(e) => setLogChannelFilter(e.target.value)}
                >
                  <option value="All">All Channels</option>
                  <option value="Call">Call</option>
                  <option value="SMS">SMS</option>
                  <option value="Viber">Viber</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-5 text-md-end">
                <button className="btn btn-primary" onClick={() => setShowLogModal(true)}>
                  <i className="bi bi-plus-lg me-2"></i>Add Contact Log
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Participant</th>
                    <th>Receipt No.</th>
                    <th>Message Type</th>
                    <th>Channel</th>
                    <th>Date Sent</th>
                    <th>Response</th>
                    <th>Call Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContactLogs.map(l => (
                    <tr key={l.id}>
                      <td><div className="fw-bold">{l.participantName}</div></td>
                      <td><code>{l.receiptNo}</code></td>
                      <td>{l.messageType}</td>
                      <td>{l.channel}</td>
                      <td>{l.dateSent}</td>
                      <td>{l.response}</td>
                      <td>{l.callStatus}</td>
                      <td>{l.notes}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteContactLog(l.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredContactLogs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-muted">No contact logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Add Confirmation Record</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfModal(false)}></button>
              </div>
              <form onSubmit={handleAddConfirmation}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Participant <span className="text-danger">*</span></label>
                      <select 
                        className="form-select" 
                        required
                        value={confForm.participantId}
                        onChange={(e) => setConfForm({...confForm, participantId: e.target.value})}
                      >
                        <option value="">Select Participant</option>
                        {participants.map(p => (
                          <option key={p.id} value={p.id}>{p.participantName} ({p.receiptNo})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Confirmation Period <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required
                        placeholder="e.g. Pre-Camp, Day 1"
                        value={confForm.confirmationPeriod}
                        onChange={(e) => setConfForm({...confForm, confirmationPeriod: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Status <span className="text-danger">*</span></label>
                      <select 
                        className="form-select" 
                        required
                        value={confForm.confirmationStatus}
                        onChange={(e) => setConfForm({...confForm, confirmationStatus: e.target.value as ConfirmationStatus})}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Not Responding">Not Responding</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Final Confirmation</label>
                      <select 
                        className="form-select" 
                        value={confForm.finalConfirmation}
                        onChange={(e) => setConfForm({...confForm, finalConfirmation: e.target.value})}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Date <span className="text-danger">*</span></label>
                      <input 
                        type="date" 
                        className="form-control" 
                        required
                        value={confForm.dateConfirmation}
                        onChange={(e) => setConfForm({...confForm, dateConfirmation: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Confirm Via <span className="text-danger">*</span></label>
                      <select 
                        className="form-select" 
                        required
                        value={confForm.confirmVia}
                        onChange={(e) => setConfForm({...confForm, confirmVia: e.target.value as ConfirmVia})}
                      >
                        <option value="Call">Call</option>
                        <option value="SMS">SMS</option>
                        <option value="Viber">Viber</option>
                        <option value="Email">Email</option>
                        <option value="In Person">In Person</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Call Status</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={confForm.callStatus}
                        onChange={(e) => setConfForm({...confForm, callStatus: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Response</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={confForm.response}
                        onChange={(e) => setConfForm({...confForm, response: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">Remarks</label>
                      <textarea 
                        className="form-control" 
                        rows={2}
                        value={confForm.remarks}
                        onChange={(e) => setConfForm({...confForm, remarks: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowConfModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Confirmation</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contact Log Modal */}
      {showLogModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Add Contact Log</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogModal(false)}></button>
              </div>
              <form onSubmit={handleAddContactLog}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Participant <span className="text-danger">*</span></label>
                      <select 
                        className="form-select" 
                        required
                        value={logForm.participantId}
                        onChange={(e) => setLogForm({...logForm, participantId: e.target.value})}
                      >
                        <option value="">Select Participant</option>
                        {participants.map(p => (
                          <option key={p.id} value={p.id}>{p.participantName} ({p.receiptNo})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Message Type <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required
                        placeholder="e.g. Welcome, Reminder"
                        value={logForm.messageType}
                        onChange={(e) => setLogForm({...logForm, messageType: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Channel <span className="text-danger">*</span></label>
                      <select 
                        className="form-select" 
                        required
                        value={logForm.channel}
                        onChange={(e) => setLogForm({...logForm, channel: e.target.value as ContactChannel})}
                      >
                        <option value="Call">Call</option>
                        <option value="SMS">SMS</option>
                        <option value="Viber">Viber</option>
                        <option value="Email">Email</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Date Sent <span className="text-danger">*</span></label>
                      <input 
                        type="date" 
                        className="form-control" 
                        required
                        value={logForm.dateSent}
                        onChange={(e) => setLogForm({...logForm, dateSent: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Call Status</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={logForm.callStatus}
                        onChange={(e) => setLogForm({...logForm, callStatus: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Response</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={logForm.response}
                        onChange={(e) => setLogForm({...logForm, response: e.target.value})}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label fw-bold">Notes</label>
                      <textarea 
                        className="form-control" 
                        rows={2}
                        value={logForm.notes}
                        onChange={(e) => setLogForm({...logForm, notes: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowLogModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Contact Log</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
