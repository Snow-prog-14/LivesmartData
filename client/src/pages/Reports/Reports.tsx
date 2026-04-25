import React, { useState, useMemo } from "react";
import { getAllParticipants } from "../../utils/participantStorage";
import {
  getParticipantTotalPaid,
  getParticipantComputedBalance,
  getParticipantComputedPaymentStatus,
} from "../../utils/paymentSummary";
import {
  getParticipantComputedConfirmationStatus,
  getParticipantComputedCallStatus,
} from "../../utils/confirmationSummary";
import * as XLSX from "xlsx";

const Reports: React.FC = () => {
  const participants = getAllParticipants();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [confirmationFilter, setConfirmationFilter] = useState("");
  const [allergyFilter, setAllergyFilter] = useState("All");

  // Computed Data for summary cards
  const summary = useMemo(() => {
    const total = participants.length;
    let confirmed = 0;
    let pending = 0;
    let notResponding = 0;
    let fullyPaid = 0;
    let withBalance = 0;
    let totalCollected = 0;
    let totalBalance = 0;
    let withAllergies = 0;

    participants.forEach((p) => {
      const confStatus = getParticipantComputedConfirmationStatus(p);
      const payStatus = getParticipantComputedPaymentStatus(p);
      const paid = getParticipantTotalPaid(p.id);
      const balance = getParticipantComputedBalance(p);

      if (confStatus === "Confirmed") confirmed++;
      if (confStatus === "Pending") pending++;
      if (confStatus === "Not Responding") notResponding++;

      if (payStatus === "Paid") fullyPaid++;
      else withBalance++;

      totalCollected += paid;
      totalBalance += balance;

      if (
        p.hasAllergyNotes ||
        (p.allergyNotes && p.allergyNotes.toLowerCase() !== "none")
      ) {
        withAllergies++;
      }
    });

    return {
      total,
      confirmed,
      pending,
      notResponding,
      fullyPaid,
      withBalance,
      totalCollected,
      totalBalance,
      withAllergies,
    };
  }, [participants]);

  // Unique programs for filter
  const programs = useMemo(() => {
    return Array.from(new Set(participants.map((p) => p.program)))
      .filter(Boolean)
      .sort();
  }, [participants]);

  // Filtered Participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.participantEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram =
        programFilter === "" || p.program === programFilter;

      let matchesPayment = true;
      const actualPaymentStatus = getParticipantComputedPaymentStatus(p);
      if (paymentFilter === "With Balance") {
        matchesPayment = actualPaymentStatus !== "Paid";
      } else if (paymentFilter !== "") {
        matchesPayment = actualPaymentStatus === paymentFilter;
      }

      const matchesConfirmation =
        confirmationFilter === "" ||
        getParticipantComputedConfirmationStatus(p) === confirmationFilter;

      let matchesAllergy = true;
      if (allergyFilter === "With Allergy Notes") {
        matchesAllergy =
          Boolean(p.hasAllergyNotes) ||
          Boolean(p.allergyNotes && p.allergyNotes.toLowerCase() !== "none");
      } else if (allergyFilter === "Without Allergy Notes") {
        matchesAllergy =
          !p.hasAllergyNotes &&
          (!p.allergyNotes || p.allergyNotes.toLowerCase() === "none");
      }

      return (
        matchesSearch &&
        matchesProgram &&
        matchesPayment &&
        matchesConfirmation &&
        matchesAllergy
      );
    });
  }, [
    participants,
    searchTerm,
    programFilter,
    paymentFilter,
    confirmationFilter,
    allergyFilter,
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const handleExportToExcel = () => {
    const exportData = filteredParticipants.map((p) => ({
      "Receipt No.": p.receiptNo,
      "Participant Name": p.participantName,
      Program: p.program,
      Intake: p.intake,
      "City of Camp": p.cityOfCamp,
      "Contact Number": p.participantNumber,
      Email: p.participantEmail,
      "Payment Status": getParticipantComputedPaymentStatus(p),
      "Total Paid": getParticipantTotalPaid(p.id),
      Balance: getParticipantComputedBalance(p),
      "Confirmation Status": getParticipantComputedConfirmationStatus(p),
      "Call Status": getParticipantComputedCallStatus(p),
      "Allergy Notes": p.allergyNotes,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, "livesmart-participant-report.xlsx");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setProgramFilter("");
    setPaymentFilter("");
    setConfirmationFilter("");
    setAllergyFilter("All");
  };

  const quickReport = (type: string) => {
    resetFilters();
    switch (type) {
      case "All":
        break;
      case "Balance":
        setPaymentFilter("With Balance");
        break;
      case "Pending":
        setConfirmationFilter("Pending");
        break;
      case "Not Responding":
        setConfirmationFilter("Not Responding");
        break;
      case "Allergies":
        setAllergyFilter("With Allergy Notes");
        break;
      default:
        break;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h2 className="mb-0">Reports</h2>
        <button className="btn btn-success" onClick={handleExportToExcel}>
          <i className="bi bi-file-earmark-excel me-2"></i>
          Export to Excel
        </button>
      </div>
      <p className="text-muted mb-4">
        View and export participant summaries and financial reports.
      </p>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Total Participants
              </h6>
              <h3 className="card-title mb-0">{summary.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 bg-primary text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">
                Confirmed Participants
              </h6>
              <h3 className="card-title mb-0">{summary.confirmed}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 bg-warning text-dark">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">
                Pending Confirmation
              </h6>
              <h3 className="card-title mb-0">{summary.pending}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 bg-danger text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">Not Responding</h6>
              <h3 className="card-title mb-0">{summary.notResponding}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Fully Paid</h6>
              <h3 className="card-title mb-0 text-success">
                {summary.fullyPaid}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">With Balance</h6>
              <h3 className="card-title mb-0 text-danger">
                {summary.withBalance}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Collected</h6>
              <h3 className="card-title mb-0 text-primary">
                {formatCurrency(summary.totalCollected)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Remaining Balance
              </h6>
              <h3 className="card-title mb-0 text-secondary">
                {formatCurrency(summary.totalBalance)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                With Allergy Notes
              </h6>
              <h3 className="card-title mb-0 text-info">
                {summary.withAllergies}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="mb-4">
        <h6 className="mb-3">Quick Reports</h6>
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => quickReport("All")}
          >
            All Participants
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => quickReport("Balance")}
          >
            With Balance
          </button>
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => quickReport("Pending")}
          >
            Pending Confirmation
          </button>
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => quickReport("Not Responding")}
          >
            Not Responding
          </button>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={() => quickReport("Allergies")}
          >
            With Allergy Notes
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small text-muted">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name, Receipt No, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small text-muted">Program</label>
              <select
                className="form-select"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="">All Programs</option>
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small text-muted">
                Payment Status
              </label>
              <select
                className="form-select"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="With Balance">With Balance</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small text-muted">
                Confirmation
              </label>
              <select
                className="form-select"
                value={confirmationFilter}
                onChange={(e) => setConfirmationFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Not Responding">Not Responding</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small text-muted">
                Allergy Filter
              </label>
              <select
                className="form-select"
                value={allergyFilter}
                onChange={(e) => setAllergyFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="With Allergy Notes">With Allergy Notes</option>
                <option value="Without Allergy Notes">
                  Without Allergy Notes
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-3">Receipt No.</th>
                  <th>Participant Name</th>
                  <th>Program</th>
                  <th>Intake</th>
                  <th>City of Camp</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>Payment Status</th>
                  <th className="text-end">Total Paid</th>
                  <th className="text-end">Balance</th>
                  <th>Confirmation</th>
                  <th>Call Status</th>
                  <th>Allergy Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p) => (
                    <tr key={p.id}>
                      <td className="px-3">{p.receiptNo}</td>
                      <td>
                        <div className="fw-bold">{p.participantName}</div>
                        <small className="text-muted">{p.nickname}</small>
                      </td>
                      <td>{p.program}</td>
                      <td>{p.intake}</td>
                      <td>{p.cityOfCamp}</td>
                      <td>{p.participantNumber}</td>
                      <td>{p.participantEmail}</td>
                      <td>
                        <span
                          className={`badge ${
                            getParticipantComputedPaymentStatus(p) === "Paid"
                              ? "bg-success-subtle text-success"
                              : getParticipantComputedPaymentStatus(p) ===
                                  "Partial"
                                ? "bg-warning-subtle text-warning"
                                : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {getParticipantComputedPaymentStatus(p)}
                        </span>
                      </td>
                      <td className="text-end">
                        {formatCurrency(getParticipantTotalPaid(p.id))}
                      </td>
                      <td className="text-end text-danger">
                        {formatCurrency(getParticipantComputedBalance(p))}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            getParticipantComputedConfirmationStatus(p) ===
                            "Confirmed"
                              ? "bg-primary"
                              : getParticipantComputedConfirmationStatus(p) ===
                                  "Pending"
                                ? "bg-warning text-dark"
                                : getParticipantComputedConfirmationStatus(
                                      p,
                                    ) === "Not Responding"
                                  ? "bg-danger"
                                  : "bg-secondary"
                          }`}
                        >
                          {getParticipantComputedConfirmationStatus(p)}
                        </span>
                      </td>
                      <td>{getParticipantComputedCallStatus(p)}</td>
                      <td>
                        <small
                          className={
                            p.hasAllergyNotes
                              ? "text-danger fw-bold"
                              : "text-muted"
                          }
                        >
                          {p.allergyNotes || "None"}
                        </small>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={13} className="text-center py-5 text-muted">
                      No participants found matching the filters.
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

export default Reports;
