import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockParticipants } from "../../mock/participants";
import type {
  ConfirmationStatus,
  Participant,
  PaymentStatus,
} from "../../mock/participants";

const Participants = () => {
  const [allParticipants, setAllParticipants] = useState<Participant[]>(mockParticipants);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    "All" | PaymentStatus
  >("All");
  const [confirmationStatusFilter, setConfirmationStatusFilter] = useState<
    "All" | ConfirmationStatus
  >("All");

  // Load from localStorage on mount and merge properly
  useEffect(() => {
    const saved = localStorage.getItem('livesmart_participants');
    if (saved) {
      try {
        const localParticipants: Participant[] = JSON.parse(saved);
        
        // Merge: local version overrides mock version if IDs match
        const merged = [...mockParticipants];
        localParticipants.forEach(lp => {
          const index = merged.findIndex(mp => mp.id === lp.id);
          if (index !== -1) {
            merged[index] = lp;
          } else {
            merged.push(lp);
          }
        });
        
        setAllParticipants(merged);
      } catch (e) {
        console.error("Failed to parse local participants", e);
      }
    }
  }, []);

  const programs = useMemo(() => {
    return ["All", ...new Set(allParticipants.map((p) => p.program))];
  }, [allParticipants]);

  const filteredParticipants = useMemo(() => {
    return allParticipants.filter((participant: Participant) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        participant.receiptNo.toLowerCase().includes(searchValue) ||
        participant.participantName.toLowerCase().includes(searchValue) ||
        participant.nickname.toLowerCase().includes(searchValue) ||
        participant.participantEmail.toLowerCase().includes(searchValue) ||
        participant.participantNumber.toLowerCase().includes(searchValue);

      const matchesProgram =
        programFilter === "All" || participant.program === programFilter;

      const matchesPaymentStatus =
        paymentStatusFilter === "All" ||
        participant.paymentStatus === paymentStatusFilter;

      const matchesConfirmationStatus =
        confirmationStatusFilter === "All" ||
        participant.confirmationStatus === confirmationStatusFilter;

      return (
        matchesSearch &&
        matchesProgram &&
        matchesPaymentStatus &&
        matchesConfirmationStatus
      );
    });
  }, [
    allParticipants,
    searchTerm,
    programFilter,
    paymentStatusFilter,
    confirmationStatusFilter,
  ]);

  const getPaymentBadgeClass = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "bg-success";
      case "Partial":
        return "bg-warning text-dark";
      case "Unpaid":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const getConfirmationBadgeClass = (status: ConfirmationStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-success";
      case "Pending":
        return "bg-warning text-dark";
      case "Not Responding":
        return "bg-danger";
      case "Cancelled":
        return "bg-secondary";
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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold mb-1">Participants</h1>
          <p className="text-muted mb-0">
            Manage participant registration, payment, and confirmation records.
          </p>
        </div>

        <Link to="/participants/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Add Participant
        </Link>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search receipt, name, email, or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg-3">
              <label className="form-label fw-semibold">Program</label>
              <select
                className="form-select"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4 col-lg-2">
              <label className="form-label fw-semibold">Payment</label>
              <select
                className="form-select"
                value={paymentStatusFilter}
                onChange={(e) =>
                  setPaymentStatusFilter(
                    e.target.value as "All" | PaymentStatus,
                  )
                }
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div className="col-12 col-md-4 col-lg-3">
              <label className="form-label fw-semibold">Confirmation</label>
              <select
                className="form-select"
                value={confirmationStatusFilter}
                onChange={(e) =>
                  setConfirmationStatusFilter(
                    e.target.value as "All" | ConfirmationStatus,
                  )
                }
              >
                <option value="All">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Not Responding">Not Responding</option>
                <option value="Cancelled">Cancelled</option>
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
                  <th className="text-center pe-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant: Participant) => (
                    <tr key={participant.id}>
                      <td className="ps-4 fw-semibold">
                        {participant.receiptNo}
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {participant.participantName}
                          {participant.hasAllergyNotes && (
                            <span className="badge bg-info-subtle text-info-emphasis ms-2">
                              Allergy
                            </span>
                          )}
                        </div>
                        <small className="text-muted">
                          Nickname: {participant.nickname}
                        </small>
                      </td>

                      <td>{participant.program}</td>
                      <td>{participant.intake}</td>
                      <td>{participant.cityOfCamp}</td>

                      <td>
                        <div>{participant.participantNumber}</div>
                        <small className="text-muted">
                          {participant.participantEmail}
                        </small>
                      </td>

                      <td>
                        <span
                          className={`badge ${getPaymentBadgeClass(
                            participant.paymentStatus,
                          )}`}
                        >
                          {participant.paymentStatus}
                        </span>
                      </td>

                      <td
                        className={
                          participant.balance > 0
                            ? "fw-semibold text-danger"
                            : "fw-semibold text-success"
                        }
                      >
                        {formatCurrency(participant.balance)}
                      </td>

                      <td>
                        <span
                          className={`badge ${getConfirmationBadgeClass(
                            participant.confirmationStatus,
                          )}`}
                        >
                          {participant.confirmationStatus}
                        </span>
                      </td>

                      <td>{participant.callStatus}</td>

                      <td className="text-center pe-4">
                        <div className="btn-group">
                          <Link
                            to={`/participants/${participant.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Link>
                          <Link
                            to={`/participants/edit/${participant.id}`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-5 text-muted">
                      <i className="bi bi-search fs-3 d-block mb-2"></i>
                      No participants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="text-muted mt-3 mb-0">
        Showing {filteredParticipants.length} of {allParticipants.length}{" "}
        participants.
      </p>
    </div>
  );
};

export default Participants;
