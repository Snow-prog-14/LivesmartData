import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { mockParticipants } from "../../mock/participants";
import type { Participant } from "../../mock/participants";
const EditParticipant: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Participant | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Load combined participants
    const saved = localStorage.getItem("livesmart_participants");
    const localParticipants: Participant[] = saved ? JSON.parse(saved) : [];

    // Merge: Local overrides mock
    const allParticipants = [...mockParticipants];
    localParticipants.forEach((lp) => {
      const index = allParticipants.findIndex((mp) => mp.id === lp.id);
      if (index !== -1) {
        allParticipants[index] = lp;
      } else {
        allParticipants.push(lp);
      }
    });

    const participant = allParticipants.find((p) => p.id === id);
    if (participant) {
      setFormData({ ...participant });
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (!formData) return;

    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: val,
          }
        : null,
    );
  };

  const validate = () => {
    if (!formData) return false;
    const newErrors: Record<string, string> = {};
    if (!formData.receiptNo) newErrors.receiptNo = "Receipt No. is required";
    if (!formData.participantName)
      newErrors.participantName = "Participant Name is required";
    if (!formData.program) newErrors.program = "Program is required";
    if (!formData.participantNumber)
      newErrors.participantNumber = "Contact Number is required";
    if (!formData.participantEmail)
      newErrors.participantEmail = "Email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validate()) return;

    // Save to localStorage
    const saved = localStorage.getItem("livesmart_participants");
    let localParticipants: Participant[] = saved ? JSON.parse(saved) : [];

    const index = localParticipants.findIndex((lp) => lp.id === formData.id);
    if (index !== -1) {
      localParticipants[index] = formData;
    } else {
      localParticipants.push(formData);
    }

    localStorage.setItem(
      "livesmart_participants",
      JSON.stringify(localParticipants),
    );

    alert("Participant updated successfully!");
    navigate("/participants");
  };

  if (notFound) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-muted">Participant not found</h3>
        <p>The participant you are trying to edit does not exist.</p>
        <Link to="/participants" className="btn btn-primary mt-3">
          Back to Participants
        </Link>
      </div>
    );
  }

  if (!formData) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Edit Participant</h2>
          <p className="text-muted">
            Update details for {formData.participantName}
          </p>
        </div>
        <Link to="/participants" className="btn btn-outline-secondary">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">
                Participant Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    Receipt No. *
                  </label>
                  <input
                    type="text"
                    name="receiptNo"
                    className={`form-control ${errors.receiptNo ? "is-invalid" : ""}`}
                    value={formData.receiptNo}
                    onChange={handleChange}
                  />
                  {errors.receiptNo && (
                    <div className="invalid-feedback">{errors.receiptNo}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    Participant Name *
                  </label>
                  <input
                    type="text"
                    name="participantName"
                    className={`form-control ${errors.participantName ? "is-invalid" : ""}`}
                    value={formData.participantName}
                    onChange={handleChange}
                  />
                  {errors.participantName && (
                    <div className="invalid-feedback">
                      {errors.participantName}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Nickname</label>
                  <input
                    type="text"
                    name="nickname"
                    className="form-control"
                    value={formData.nickname}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    Contact Number *
                  </label>
                  <input
                    type="text"
                    name="participantNumber"
                    className={`form-control ${errors.participantNumber ? "is-invalid" : ""}`}
                    value={formData.participantNumber}
                    onChange={handleChange}
                  />
                  {errors.participantNumber && (
                    <div className="invalid-feedback">
                      {errors.participantNumber}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="participantEmail"
                    className={`form-control ${errors.participantEmail ? "is-invalid" : ""}`}
                    value={formData.participantEmail}
                    onChange={handleChange}
                  />
                  {errors.participantEmail && (
                    <div className="invalid-feedback">
                      {errors.participantEmail}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Program *</label>
                  <select
                    name="program"
                    className={`form-select ${errors.program ? "is-invalid" : ""}`}
                    value={formData.program}
                    onChange={handleChange}
                  >
                    <option value="">Select Program</option>
                    <option value="Youth Leadership">Youth Leadership</option>
                    <option value="Creative Writing">Creative Writing</option>
                    <option value="Science Exploration">
                      Science Exploration
                    </option>
                  </select>
                  {errors.program && (
                    <div className="invalid-feedback">{errors.program}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    City of Camp
                  </label>
                  <input
                    type="text"
                    name="cityOfCamp"
                    className="form-control"
                    value={formData.cityOfCamp}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Intake</label>
                  <input
                    type="text"
                    name="intake"
                    className="form-control"
                    value={formData.intake}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">Notes</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="hasAllergyNotes"
                      checked={formData.hasAllergyNotes}
                      onChange={handleChange}
                      id="allergySwitch"
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="allergySwitch"
                    >
                      Has Allergy Notes
                    </label>
                  </div>
                  {formData.hasAllergyNotes && (
                    <div className="mb-3">
                      <label className="form-label small fw-bold">
                        Allergy Details
                      </label>
                      <textarea
                        name="allergyNotes"
                        className="form-control"
                        rows={2}
                        value={formData.allergyNotes}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Remarks</label>
                  <textarea
                    name="remarks"
                    className="form-control"
                    rows={3}
                    value={formData.remarks}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">Status Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    className="form-select"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">
                    Balance Amount
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      name="balance"
                      className="form-control"
                      value={formData.balance}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">
                    Confirmation Status
                  </label>
                  <select
                    name="confirmationStatus"
                    className="form-select"
                    value={formData.confirmationStatus}
                    onChange={handleChange}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Responding">Not Responding</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">
                    Call Status
                  </label>
                  <input
                    type="text"
                    name="callStatus"
                    className="form-control"
                    value={formData.callStatus}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold"
                  >
                    Update Participant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditParticipant;
