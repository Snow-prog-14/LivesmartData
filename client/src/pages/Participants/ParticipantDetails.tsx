import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getParticipantPayments,
  getParticipantTotalPaid,
  getParticipantComputedBalance,
  getParticipantComputedPaymentStatus,
} from "../../utils/paymentSummary";
import { getAllParticipants } from "../../utils/participantStorage";
import {
  getParticipantConfirmations,
  getParticipantComputedConfirmationStatus,
  getParticipantComputedCallStatus,
} from "../../utils/confirmationSummary";
import { getParticipantContactLogs } from "../../utils/contactLogSummary";

const ParticipantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Load and merge data to find the correct participant
  const participant = useMemo(() => {
    const all = getAllParticipants();
    return all.find((p) => p.id === id);
  }, [id]);

  if (!participant) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-muted">Participant not found</h3>
        <p>The participant with ID {id} does not exist in our records.</p>
        <Link to="/participants" className="btn btn-primary mt-3">
          <i className="bi bi-arrow-left me-2"></i>Back to Participants
        </Link>
      </div>
    );
  }

  // Computed values
  const payments = getParticipantPayments(participant.id);
  const totalPaid = getParticipantTotalPaid(participant.id);
  const computedBalance = getParticipantComputedBalance(participant);
  const computedPaymentStatus =
    getParticipantComputedPaymentStatus(participant);
  const computedConfStatus =
    getParticipantComputedConfirmationStatus(participant);
  const computedCallStatus = getParticipantComputedCallStatus(participant);
  const confirmationRecords = getParticipantConfirmations(participant.id);
  const contactLogs = getParticipantContactLogs(participant.id);

  const getBadgeClass = (status: string) => {
    switch (status) {
      case "Paid":
      case "Confirmed":
        return "bg-success";
      case "Partial":
      case "Pending":
        return "bg-warning text-dark";
      case "Unpaid":
      case "Not Responding":
        return "bg-info text-dark";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <Link to="/participants">Participants</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Details
              </li>
            </ol>
          </nav>
          <h2 className="fw-bold mb-1">{participant.participantName}</h2>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="text-muted">
              Receipt:{" "}
              <span className="text-primary fw-medium">
                {participant.receiptNo}
              </span>
            </span>
            <span className="text-muted">|</span>
            <span className="text-muted">
              Program: <span className="fw-medium">{participant.program}</span>
            </span>
            <span
              className={`badge ${getBadgeClass(computedPaymentStatus)} ms-2`}
            >
              Payment: {computedPaymentStatus}
            </span>
            <span className={`badge ${getBadgeClass(computedConfStatus)}`}>
              Conf: {computedConfStatus}
            </span>
          </div>
        </div>
        <Link to="/participants" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>Back
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-0 pt-3">
          <ul
            className="nav nav-tabs card-header-tabs"
            id="participantTabs"
            role="tablist"
          >
            <li className="nav-item">
              <button
                className="nav-link active"
                id="personal-tab"
                data-bs-toggle="tab"
                data-bs-target="#personal"
                type="button"
                role="tab"
              >
                Personal Info
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="parents-tab"
                data-bs-toggle="tab"
                data-bs-target="#parents"
                type="button"
                role="tab"
              >
                Parents / Guardians
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="registration-tab"
                data-bs-toggle="tab"
                data-bs-target="#registration"
                type="button"
                role="tab"
              >
                Registration
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="payments-tab"
                data-bs-toggle="tab"
                data-bs-target="#payments"
                type="button"
                role="tab"
              >
                Payments
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="confirmation-tab"
                data-bs-toggle="tab"
                data-bs-target="#confirmation"
                type="button"
                role="tab"
              >
                Confirmation
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="logs-tab"
                data-bs-toggle="tab"
                data-bs-target="#logs"
                type="button"
                role="tab"
              >
                Contact Logs
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="allergies-tab"
                data-bs-toggle="tab"
                data-bs-target="#allergies"
                type="button"
                role="tab"
              >
                Allergies / Remarks
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body p-4">
          <div className="tab-content" id="participantTabsContent">
            {/* Personal Info Tab */}
            <div
              className="tab-pane fade show active"
              id="personal"
              role="tabpanel"
            >
              <div className="row g-4">
                <div className="col-md-4">
                  <label className="text-muted small d-block">Full Name</label>
                  <span className="fw-bold">{participant.participantName}</span>
                </div>
                <div className="col-md-4">
                  <label className="text-muted small d-block">Nickname</label>
                  <span>{participant.nickname}</span>
                </div>
                <div className="col-md-4">
                  <label className="text-muted small d-block">
                    Contact Number
                  </label>
                  <span>{participant.participantNumber}</span>
                </div>
                <div className="col-md-4">
                  <label className="text-muted small d-block">
                    Email Address
                  </label>
                  <span>{participant.participantEmail}</span>
                </div>
                <div className="col-md-4">
                  <label className="text-muted small d-block">Program</label>
                  <span>{participant.program}</span>
                </div>
                <div className="col-md-2">
                  <label className="text-muted small d-block">Intake</label>
                  <span>{participant.intake}</span>
                </div>
                <div className="col-md-2">
                  <label className="text-muted small d-block">
                    City of Camp
                  </label>
                  <span>{participant.cityOfCamp}</span>
                </div>
              </div>
            </div>

            {/* Parents Tab */}
            <div className="tab-pane fade" id="parents" role="tabpanel">
              <div className="row g-4">
                <div className="col-md-6 border-end">
                  <h6 className="fw-bold mb-3">Father's Information</h6>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="text-muted small d-block">
                        First Name
                      </label>
                      <span>{participant.fatherFirstName}</span>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small d-block">
                        Last Name
                      </label>
                      <span>{participant.fatherLastName}</span>
                    </div>
                    <div className="col-12">
                      <label className="text-muted small d-block">Email</label>
                      <span>{participant.fatherEmail}</span>
                    </div>
                    <div className="col-12">
                      <label className="text-muted small d-block">
                        Mobile Number
                      </label>
                      <span>{participant.fatherMobile}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 ps-md-4">
                  <h6 className="fw-bold mb-3">Mother's Information</h6>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="text-muted small d-block">
                        First Name
                      </label>
                      <span>{participant.motherFirstName}</span>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small d-block">
                        Last Name
                      </label>
                      <span>{participant.motherLastName}</span>
                    </div>
                    <div className="col-12">
                      <label className="text-muted small d-block">Email</label>
                      <span>{participant.motherEmail}</span>
                    </div>
                    <div className="col-12">
                      <label className="text-muted small d-block">
                        Mobile Number
                      </label>
                      <span>{participant.motherMobile}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Tab */}
            <div className="tab-pane fade" id="registration" role="tabpanel">
              <div className="row g-4">
                <div className="col-md-3">
                  <label className="text-muted small d-block">
                    Signed Up Year
                  </label>
                  <span>{participant.signUpYear}</span>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small d-block">
                    City of Preview
                  </label>
                  <span>{participant.cityOfPreview}</span>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small d-block">
                    Introductory Venue
                  </label>
                  <span>{participant.introVenue}</span>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small d-block">
                    Preview Trainer
                  </label>
                  <span>{participant.previewTrainer}</span>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small d-block">
                    Sign-up Date
                  </label>
                  <span>{participant.signUpDate}</span>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small d-block">
                    Key-in Date
                  </label>
                  <span>{participant.keyInDate}</span>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small d-block">
                    Seminar Package
                  </label>
                  <span>{participant.seminarPackage}</span>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small d-block">Discounts</label>
                  <span>{participant.discounts}</span>
                </div>
                <div className="col-md-12">
                  <label className="text-muted small d-block">
                    Final Package
                  </label>
                  <span className="fw-bold">{participant.finalPackage}</span>
                </div>
              </div>
            </div>

            {/* Payments Tab */}
            <div className="tab-pane fade" id="payments" role="tabpanel">
              <div className="table-responsive mb-4">
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Payment No.</th>
                      <th>Amount</th>
                      <th>Mode</th>
                      <th>Date</th>
                      <th>Tracking No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? (
                      payments.map((pay) => (
                        <tr key={pay.id}>
                          <td>{pay.paymentNumber}</td>
                          <td className="fw-bold">
                            {formatCurrency(pay.amount)}
                          </td>
                          <td>{pay.modeOfPayment}</td>
                          <td>{pay.paymentDate}</td>
                          <td className="text-muted">{pay.trackingNumber}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-3 text-muted">
                          No payments recorded for this participant.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="row justify-content-end">
                <div className="col-md-4">
                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Paid:</span>
                        <span className="fw-bold text-success">
                          {formatCurrency(totalPaid)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Balance:</span>
                        <span className="fw-bold text-danger">
                          {formatCurrency(computedBalance)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between border-top pt-2">
                        <span>Status:</span>
                        <span
                          className={`badge ${getBadgeClass(computedPaymentStatus)}`}
                        >
                          {computedPaymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Tab */}
            <div className="tab-pane fade" id="confirmation" role="tabpanel">
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <label className="text-muted small d-block">
                    Current Computed Status
                  </label>
                  <span
                    className={`badge ${getBadgeClass(computedConfStatus)}`}
                  >
                    {computedConfStatus}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="text-muted small d-block">
                    Current Call Status
                  </label>
                  <span className="text-primary fw-bold">
                    {computedCallStatus}
                  </span>
                </div>
              </div>

              <h6 className="fw-bold mb-3">Confirmation History</h6>
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Period</th>
                      <th>Status</th>
                      <th>Final</th>
                      <th>Date</th>
                      <th>Via</th>
                      <th>Call Status</th>
                      <th>Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmationRecords.length > 0 ? (
                      confirmationRecords.map((rec) => (
                        <tr key={rec.id}>
                          <td>{rec.confirmationPeriod}</td>
                          <td>
                            <span
                              className={`badge ${getBadgeClass(rec.confirmationStatus)}`}
                            >
                              {rec.confirmationStatus}
                            </span>
                          </td>
                          <td>{rec.finalConfirmation}</td>
                          <td>{rec.dateConfirmation}</td>
                          <td>{rec.confirmVia}</td>
                          <td>{rec.callStatus}</td>
                          <td>{rec.response}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-3 text-muted">
                          No confirmation history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logs Tab */}
            <div className="tab-pane fade" id="logs" role="tabpanel">
              <div className="table-responsive">
                <table className="table table-hover table-sm border">
                  <thead className="table-light">
                    <tr>
                      <th>Type</th>
                      <th>Channel</th>
                      <th>Date Sent</th>
                      <th>Response</th>
                      <th>Call Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactLogs.length > 0 ? (
                      contactLogs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.messageType}</td>
                          <td>{log.channel}</td>
                          <td>{log.dateSent}</td>
                          <td>{log.response}</td>
                          <td>{log.callStatus}</td>
                          <td>{log.notes}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-3 text-muted">
                          No contact logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Allergies Tab */}
            <div className="tab-pane fade" id="allergies" role="tabpanel">
              <div className="row g-4">
                <div className="col-12">
                  <h6 className="fw-bold">Allergy Notes</h6>
                  <div className="p-3 bg-light rounded border">
                    {participant.allergyNotes || "No allergy notes provided."}
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold">Remarks</h6>
                  <p className="text-muted">
                    {participant.remarks || "No remarks."}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold">Status Notes</h6>
                  <p className="text-muted">
                    {participant.statusNotes || "No status notes."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetails;
