import React, { useMemo, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("personal");

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
        <div className="d-flex gap-2">
          <Link to={`/participants/edit/${participant.id}`} className="btn btn-primary">
            <i className="bi bi-pencil me-2"></i>Edit
          </Link>
          <Link to="/participants" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>Back
          </Link>
        </div>
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
                className={`nav-link ${activeTab === "personal" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("personal")}
              >
                Personal Info
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "parents" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("parents")}
              >
                Parents / Guardians
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "registration" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("registration")}
              >
                Registration
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "payments" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("payments")}
              >
                Payments
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "confirmation" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("confirmation")}
              >
                Confirmation
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "contactLogs" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("contactLogs")}
              >
                Contact Logs
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "allergies" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("allergies")}
              >
                Allergies / Remarks
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body p-4">
          <div className="tab-content" id="participantTabsContent">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="row g-4 mb-4 pb-4 border-bottom">
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Full Name</label>
                    <span className="fw-bold">{participant.participantName}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Nickname</label>
                    <span>{participant.nickname}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Gender</label>
                    <span>{participant.gender || "Not specified"}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Date of Birth</label>
                    <span>{participant.dateOfBirth || "Not specified"}</span>
                  </div>
                  <div className="col-md-2">
                    <label className="text-muted small d-block">Age</label>
                    <span>{participant.age || "N/A"}</span>
                  </div>
                  <div className="col-md-2">
                    <label className="text-muted small d-block">T-Shirt Size</label>
                    <span>{participant.tShirtSize || "N/A"}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">School</label>
                    <span>{participant.school || "Not specified"}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Contact Number</label>
                    <span>{participant.participantNumber}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Email Address</label>
                    <span>{participant.participantEmail}</span>
                  </div>
                </div>
                <div className="row g-4">
                  <div className="col-12">
                    <h6 className="fw-bold mb-3 text-primary">Mailing Address</h6>
                  </div>
                  <div className="col-md-12">
                    <label className="text-muted small d-block">Address</label>
                    <span>{participant.mailingAddress || "Not specified"}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">City</label>
                    <span>{participant.city || "N/A"}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">State / Province</label>
                    <span>{participant.state || "N/A"}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Country</label>
                    <span>{participant.country || "N/A"}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Postal Code</label>
                    <span>{participant.postalCode || "N/A"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Parents Tab */}
            {activeTab === "parents" && (
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="row g-4">
                  <div className="col-md-6 border-end">
                    <h6 className="fw-bold mb-3 text-primary">Father's Information</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="text-muted small d-block">Name</label>
                        <span className="fw-bold">{participant.fatherFirstName} {participant.fatherLastName}</span>
                      </div>
                      <div className="col-12">
                        <label className="text-muted small d-block">Email</label>
                        <span>{participant.fatherEmail || "N/A"}</span>
                      </div>
                      <div className="col-12">
                        <label className="text-muted small d-block">Mobile Number</label>
                        <span>{participant.fatherMobile || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 ps-md-4">
                    <h6 className="fw-bold mb-3 text-primary">Mother's Information</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="text-muted small d-block">Name</label>
                        <span className="fw-bold">{participant.motherFirstName} {participant.motherLastName}</span>
                      </div>
                      <div className="col-12">
                        <label className="text-muted small d-block">Email</label>
                        <span>{participant.motherEmail || "N/A"}</span>
                      </div>
                      <div className="col-12">
                        <label className="text-muted small d-block">Mobile Number</label>
                        <span>{participant.motherMobile || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Tab */}
            {activeTab === "registration" && (
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="row g-4 mb-4 pb-4 border-bottom">
                  <div className="col-12"><h6 className="fw-bold text-primary">Registration Details</h6></div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Signed Up Year</label>
                    <span>{participant.signedUpYear || participant.signUpYear}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">City of Preview</label>
                    <span>{participant.cityOfPreview}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">City of Camp</label>
                    <span>{participant.cityOfCamp}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Introductory Venue</label>
                    <span>{participant.introductoryVenue || participant.introVenue}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Program</label>
                    <span className="fw-bold">{participant.program}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Intake (Reg Form)</label>
                    <span>{participant.intakeBasedOnRegistration}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Intake Confirmation</label>
                    <span className="text-primary fw-bold">{participant.intakeConfirmation}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Sign-up Date</label>
                    <span>{participant.signUpDate}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Key-in Date / Time</label>
                    <span>{participant.keyInDate} {participant.keyInTime}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Preview Trainer</label>
                    <span>{participant.previewTrainer}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Preview IC</label>
                    <span>{participant.previewIC}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Status 2</label>
                    <span>{participant.status2}</span>
                  </div>
                </div>
                
                <div className="row g-4">
                  <div className="col-12"><h6 className="fw-bold text-primary">Package & Pricing</h6></div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Seminar Package</label>
                    <span>{participant.seminarPackage}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Discounts</label>
                    <span>{participant.discounts}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small d-block">Final Package</label>
                    <span className="fw-bold text-success">{participant.finalPackage}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Preview Payment</label>
                    <span>{formatCurrency(participant.previewPayment || 0)}</span>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small d-block">Payment Mode</label>
                    <span>{participant.previewPaymentType}</span>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small d-block">Tracking / Ref No.</label>
                    <span className="text-muted small">{participant.previewPaymentTracking}</span>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small d-block">When to Pay</label>
                    <span>{participant.whenToPay}</span>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small d-block">Dates to Send Reminders</label>
                    <span className="text-danger small">{participant.datesToSendReminders}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div className="tab-pane fade show active" role="tabpanel">
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
                            <td className="text-muted small">{pay.trackingNumber}</td>
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
                          <span className={`badge ${getBadgeClass(computedPaymentStatus)}`}>
                            {computedPaymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Tab */}
            {activeTab === "confirmation" && (
              <div className="tab-pane fade show active" role="tabpanel">
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
            )}

            {/* Logs Tab */}
            {activeTab === "contactLogs" && (
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="table-responsive">
                  <table className="table table-hover table-sm border">
                    <thead className="table-light">
                      <tr>
                        <th>Type</th>
                        <th>Channel</th>
                        <th>Date Sent</th>
                        <th>Response</th>
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
                            <td className="small">{log.notes}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-3 text-muted">
                            No contact logs found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Allergies Tab */}
            {activeTab === "allergies" && (
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="row g-4">
                  <div className="col-12">
                    <h6 className="fw-bold text-danger">Allergy Notes</h6>
                    <div className="p-3 bg-danger-subtle rounded border border-danger-subtle">
                      {participant.hasAllergyNotes ? participant.allergyNotes : "No allergy notes provided."}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Remarks</h6>
                    <div className="p-3 bg-light rounded border">
                      {participant.remarks || "No remarks recorded."}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Status 2</h6>
                    <div className="p-3 bg-light rounded border">
                      {participant.status2 || "N/A"}
                    </div>
                  </div>
                  <div className="col-12">
                    <h6 className="fw-bold">Status Notes</h6>
                    <p className="text-muted">
                      {participant.statusNotes || "No status notes."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetails;
