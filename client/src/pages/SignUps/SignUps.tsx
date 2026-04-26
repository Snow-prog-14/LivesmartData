import { useMemo, useState } from "react";
import { deleteSignUp, getAllSignUps } from "../../utils/signUpStorage";
import type { SignUpRecord } from "../../mock/signUps";

const SignUps = () => {
  const [signUps, setSignUps] = useState<SignUpRecord[]>(getAllSignUps());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<SignUpRecord | null>(
    null,
  );

  const filteredSignUps = useMemo(() => {
    return signUps.filter((record) => {
      const searchValue = searchTerm.toLowerCase();

      const childMatches = record.children.some(
        (child) =>
          child.name.toLowerCase().includes(searchValue) ||
          child.school.toLowerCase().includes(searchValue) ||
          child.gender.toLowerCase().includes(searchValue) ||
          child.campDate.toLowerCase().includes(searchValue) ||
          child.size.toLowerCase().includes(searchValue),
      );

      return (
        record.guardianName.toLowerCase().includes(searchValue) ||
        record.mop.toLowerCase().includes(searchValue) ||
        record.paymentOrDeposit.toLowerCase().includes(searchValue) ||
        record.contactReminders.toLowerCase().includes(searchValue) ||
        record.signUpPreviewDate.toLowerCase().includes(searchValue) ||
        childMatches
      );
    });
  }, [signUps, searchTerm]);

  const refreshSignUps = () => {
    setSignUps(getAllSignUps());
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sign up record?",
    );

    if (!confirmed) {
      return;
    }

    deleteSignUp(id);
    setSelectedRecord(null);
    refreshSignUps();
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
          <h1 className="fw-bold mb-1">Sign Ups</h1>
          <p className="text-muted mb-0">
            Manage guardians, payment details, preview sign-up date, reminders,
            and child information.
          </p>
        </div>

        <button className="btn btn-primary" disabled>
          <i className="bi bi-plus-lg me-2"></i>
          Add Sign Up
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-5">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search guardian, MOP, reminder, child, school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Sign Up Details</h5>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSelectedRecord(null)}
            >
              Close
            </button>
          </div>

          <div className="card-body">
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <small className="text-muted">Guardian Name</small>
                <div className="fw-semibold">{selectedRecord.guardianName}</div>
              </div>

              <div className="col-12 col-md-4">
                <small className="text-muted">MOP</small>
                <div className="fw-semibold">{selectedRecord.mop}</div>
              </div>

              <div className="col-12 col-md-4">
                <small className="text-muted">Payment or Deposit</small>
                <div className="fw-semibold">
                  {selectedRecord.paymentOrDeposit}
                </div>
              </div>

              <div className="col-12 col-md-4">
                <small className="text-muted">Child Payment</small>
                <div className="fw-semibold">
                  {formatCurrency(selectedRecord.childPayment)}
                </div>
              </div>

              <div className="col-12 col-md-4">
                <small className="text-muted">Sign Up Preview Date</small>
                <div className="fw-semibold">
                  {selectedRecord.signUpPreviewDate}
                </div>
              </div>

              <div className="col-12 col-md-4">
                <small className="text-muted">Contact Reminders</small>
                <div className="fw-semibold">
                  {selectedRecord.contactReminders || "—"}
                </div>
              </div>
            </div>

            <h6 className="fw-bold mb-3">Child Info</h6>

            <div className="table-responsive">
              <table className="table table-sm table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>School</th>
                    <th>Gender</th>
                    <th>Camp Date</th>
                    <th>Size</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedRecord.children.length > 0 ? (
                    selectedRecord.children.map((child, index) => (
                      <tr key={`${child.name}-${index}`}>
                        <td>{child.name}</td>
                        <td>{child.school}</td>
                        <td>{child.gender}</td>
                        <td>{child.campDate}</td>
                        <td>{child.size}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        No child information added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Guardian Name</th>
                  <th>MOP</th>
                  <th>Payment or Deposit</th>
                  <th>Child Payment</th>
                  <th>Sign Up Preview Date</th>
                  <th>Contact Reminders</th>
                  <th className="text-center pe-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSignUps.length > 0 ? (
                  filteredSignUps.map((record) => (
                    <tr key={record.id}>
                      <td className="ps-4 fw-semibold">
                        {record.guardianName}
                      </td>

                      <td>{record.mop}</td>

                      <td>
                        <span
                          className={`badge ${
                            record.paymentOrDeposit === "Full Payment"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {record.paymentOrDeposit}
                        </span>
                      </td>

                      <td className="fw-semibold">
                        {formatCurrency(record.childPayment)}
                      </td>

                      <td>{record.signUpPreviewDate}</td>

                      <td style={{ minWidth: "220px" }}>
                        {record.contactReminders || "—"}
                      </td>

                      <td className="text-center pe-4">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedRecord(record)}
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      No sign up records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="text-muted mt-3 mb-0">
        Showing {filteredSignUps.length} of {signUps.length} sign up records.
      </p>
    </div>
  );
};

export default SignUps;
