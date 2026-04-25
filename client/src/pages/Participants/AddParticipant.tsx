import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import type {
  Participant,
  PaymentStatus,
  ConfirmationStatus,
} from "../../mock/participants";
import { getSettings } from "../../utils/settingsStorage";

const AddParticipant: React.FC = () => {
  const navigate = useNavigate();

  // Load settings for dropdowns
  const programs = useMemo(() => getSettings('programs').filter(s => s.isActive), []);
  const campCities = useMemo(() => getSettings('cityOfCamp').filter(s => s.isActive), []);
  const previewCities = useMemo(() => getSettings('cityOfPreview').filter(s => s.isActive), []);
  const venues = useMemo(() => getSettings('introductoryVenues').filter(s => s.isActive), []);
  const paymentModes = useMemo(() => getSettings('paymentModes').filter(s => s.isActive), []);
  const callStatuses = useMemo(() => getSettings('callStatuses').filter(s => s.isActive), []);

  // Form state
  const [formData, setFormData] = useState({
    // A. Participant Information
    receiptNo: "",
    participantName: "",
    nickname: "",
    participantNumber: "",
    participantEmail: "",
    gender: "",
    dateOfBirth: "",
    age: 0,
    school: "",
    tShirtSize: "",

    // B. Parent / Guardian Information
    fatherFirstName: "",
    fatherLastName: "",
    fatherEmail: "",
    fatherMobile: "",
    motherFirstName: "",
    motherLastName: "",
    motherEmail: "",
    motherMobile: "",

    // C. Address Information
    mailingAddress: "",
    city: "",
    state: "",
    country: "Philippines",
    postalCode: "",

    // D. Registration Information
    signedUpYear: new Date().getFullYear().toString(),
    cityOfPreview: "",
    cityOfCamp: "",
    introductoryVenue: "",
    program: "",
    intakeBasedOnRegistration: "",
    intakeConfirmation: "",
    signUpDate: new Date().toISOString().split("T")[0],
    keyInDate: new Date().toISOString().split("T")[0],
    previewTrainer: "",
    previewIC: "",
    keyInTime: "",
    status2: "",

    // E. Package / Pricing Information
    seminarPackage: "",
    discounts: "",
    finalPackage: "",
    previewPayment: 0,
    previewPaymentType: "",
    previewPaymentTracking: "",
    whenToPay: "",
    datesToSendReminders: "",

    // F. Notes & Status
    hasAllergyNotes: false,
    allergyNotes: "",
    remarks: "",
    paymentStatus: "Unpaid" as PaymentStatus,
    balance: 0,
    confirmationStatus: "Pending" as ConfirmationStatus,
    callStatus: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculate age
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.dateOfBirth]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const validate = () => {
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

    if (!validate()) {
      window.scrollTo(0, 0);
      return;
    }

    const newParticipant: Participant = {
      ...formData,
      id: Date.now().toString(),
      balance: Number(formData.balance),
      previewPayment: Number(formData.previewPayment),
      signUpYear: formData.signedUpYear, // ensure mapping
      introVenue: formData.introductoryVenue, // ensure mapping
      paymentHistory: [],
      contactLogs: [],
      statusNotes: "",
      intake: formData.intakeConfirmation || formData.intakeBasedOnRegistration, // fallback for intake
    };

    // Save to localStorage
    const existingData = localStorage.getItem("livesmart_participants");
    const participants = existingData ? JSON.parse(existingData) : [];
    participants.push(newParticipant);
    localStorage.setItem(
      "livesmart_participants",
      JSON.stringify(participants),
    );

    alert("Participant added successfully!");
    navigate("/participants");
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Add New Participant V2</h2>
          <p className="text-muted">Register a participant with complete registration details.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/participants" className="btn btn-outline-secondary">Cancel</Link>
          <button type="submit" form="participantForm" className="btn btn-primary px-4">Save Participant</button>
        </div>
      </div>

      <form id="participantForm" onSubmit={handleSubmit} className="row g-4">
        <div className="col-lg-8">
          {/* A. Participant Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">A. Participant Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Receipt No. *</label>
                  <input type="text" name="receiptNo" className={`form-control ${errors.receiptNo ? "is-invalid" : ""}`} value={formData.receiptNo} onChange={handleChange} />
                  {errors.receiptNo && <div className="invalid-feedback">{errors.receiptNo}</div>}
                </div>
                <div className="col-md-8">
                  <label className="form-label small fw-bold">Participant Name *</label>
                  <input type="text" name="participantName" className={`form-control ${errors.participantName ? "is-invalid" : ""}`} value={formData.participantName} onChange={handleChange} />
                  {errors.participantName && <div className="invalid-feedback">{errors.participantName}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Nickname</label>
                  <input type="text" name="nickname" className="form-control" value={formData.nickname} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Gender</label>
                  <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">T-Shirt Size</label>
                  <input type="text" name="tShirtSize" className="form-control" placeholder="e.g. S, M, L, XL" value={formData.tShirtSize} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Contact Number *</label>
                  <input type="text" name="participantNumber" className={`form-control ${errors.participantNumber ? "is-invalid" : ""}`} value={formData.participantNumber} onChange={handleChange} />
                  {errors.participantNumber && <div className="invalid-feedback">{errors.participantNumber}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Email Address *</label>
                  <input type="email" name="participantEmail" className={`form-control ${errors.participantEmail ? "is-invalid" : ""}`} value={formData.participantEmail} onChange={handleChange} />
                  {errors.participantEmail && <div className="invalid-feedback">{errors.participantEmail}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Date of Birth</label>
                  <input type="date" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-bold">Age</label>
                  <input type="number" name="age" className="form-control" value={formData.age} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">School</label>
                  <input type="text" name="school" className="form-control" value={formData.school} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* B. Parent / Guardian Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">B. Parent / Guardian Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6 border-end">
                  <h6 className="fw-bold mb-3 text-muted small">FATHER'S INFO</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold">First Name</label>
                      <input type="text" name="fatherFirstName" className="form-control" value={formData.fatherFirstName} onChange={handleChange} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Last Name</label>
                      <input type="text" name="fatherLastName" className="form-control" value={formData.fatherLastName} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Email</label>
                      <input type="email" name="fatherEmail" className="form-control" value={formData.fatherEmail} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Mobile</label>
                      <input type="text" name="fatherMobile" className="form-control" value={formData.fatherMobile} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3 text-muted small">MOTHER'S INFO</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold">First Name</label>
                      <input type="text" name="motherFirstName" className="form-control" value={formData.motherFirstName} onChange={handleChange} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Last Name</label>
                      <input type="text" name="motherLastName" className="form-control" value={formData.motherLastName} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Email</label>
                      <input type="email" name="motherEmail" className="form-control" value={formData.motherEmail} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Mobile</label>
                      <input type="text" name="motherMobile" className="form-control" value={formData.motherMobile} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* C. Address Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">C. Address Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold">Mailing Address</label>
                  <input type="text" name="mailingAddress" className="form-control" value={formData.mailingAddress} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">City</label>
                  <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Province / State</label>
                  <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Country</label>
                  <input type="text" name="country" className="form-control" value={formData.country} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Postal Code</label>
                  <input type="text" name="postalCode" className="form-control" value={formData.postalCode} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* D. Registration Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">D. Registration Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Signed Up Year</label>
                  <input type="text" name="signedUpYear" className="form-control" value={formData.signedUpYear} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">City of Preview</label>
                  <select name="cityOfPreview" className="form-select" value={formData.cityOfPreview} onChange={handleChange}>
                    <option value="">Select City</option>
                    {previewCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">City of Camp</label>
                  <select name="cityOfCamp" className="form-select" value={formData.cityOfCamp} onChange={handleChange}>
                    <option value="">Select City</option>
                    {campCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Introductory Venue</label>
                  <select name="introductoryVenue" className="form-select" value={formData.introductoryVenue} onChange={handleChange}>
                    <option value="">Select Venue</option>
                    {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Program *</label>
                  <select name="program" className={`form-select ${errors.program ? "is-invalid" : ""}`} value={formData.program} onChange={handleChange}>
                    <option value="">Select Program</option>
                    {programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  {errors.program && <div className="invalid-feedback">{errors.program}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Intake (Registration Form)</label>
                  <input type="text" name="intakeBasedOnRegistration" className="form-control" value={formData.intakeBasedOnRegistration} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Intake Confirmation</label>
                  <input type="text" name="intakeConfirmation" className="form-control" value={formData.intakeConfirmation} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Sign-up Date</label>
                  <input type="date" name="signUpDate" className="form-control" value={formData.signUpDate} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Key-in Date</label>
                  <input type="date" name="keyInDate" className="form-control" value={formData.keyInDate} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Key-in Time</label>
                  <input type="time" name="keyInTime" className="form-control" value={formData.keyInTime} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Preview Trainer</label>
                  <input type="text" name="previewTrainer" className="form-control" value={formData.previewTrainer} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Preview IC</label>
                  <input type="text" name="previewIC" className="form-control" value={formData.previewIC} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Status 2</label>
                  <input type="text" name="status2" className="form-control" value={formData.status2} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* E. Package / Pricing Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">E. Package / Pricing Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Seminar Package</label>
                  <input type="text" name="seminarPackage" className="form-control" value={formData.seminarPackage} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Discounts</label>
                  <input type="text" name="discounts" className="form-control" value={formData.discounts} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Final Package</label>
                  <input type="text" name="finalPackage" className="form-control fw-bold text-primary" value={formData.finalPackage} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Preview Payment</label>
                  <input type="number" name="previewPayment" className="form-control" value={formData.previewPayment} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Payment Type</label>
                  <select name="previewPaymentType" className="form-select" value={formData.previewPaymentType} onChange={handleChange}>
                    <option value="">Select Mode</option>
                    {paymentModes.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Tracking / Ref No.</label>
                  <input type="text" name="previewPaymentTracking" className="form-control" value={formData.previewPaymentTracking} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">When to Pay</label>
                  <input type="text" name="whenToPay" className="form-control" value={formData.whenToPay} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Dates to Send Reminders</label>
                  <input type="text" name="datesToSendReminders" className="form-control" placeholder="e.g. 2024-05-01, 2024-05-15" value={formData.datesToSendReminders} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* F. Notes & Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">F. Notes & Status</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-check form-switch mb-2">
                    <input className="form-check-input" type="checkbox" name="hasAllergyNotes" checked={formData.hasAllergyNotes} onChange={handleChange} id="allergySwitch" />
                    <label className="form-check-label fw-bold" htmlFor="allergySwitch">Has Allergy Notes</label>
                  </div>
                  {formData.hasAllergyNotes && (
                    <textarea name="allergyNotes" className="form-control mb-3" rows={2} placeholder="Enter allergy details..." value={formData.allergyNotes} onChange={handleChange}></textarea>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Remarks</label>
                  <textarea name="remarks" className="form-control" rows={3} value={formData.remarks} onChange={handleChange}></textarea>
                </div>
                <hr className="my-3" />
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Initial Payment Status</label>
                  <select name="paymentStatus" className="form-select" value={formData.paymentStatus} onChange={handleChange}>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Initial Balance</label>
                  <div className="input-group">
                    <span className="input-group-text">₱</span>
                    <input type="number" name="balance" className="form-control" value={formData.balance} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Confirmation Status</label>
                  <select name="confirmationStatus" className="form-select" value={formData.confirmationStatus} onChange={handleChange}>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Not Responding">Not Responding</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Call Status</label>
                  <select name="callStatus" className="form-select" value={formData.callStatus} onChange={handleChange}>
                    <option value="">Select Status</option>
                    {callStatuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">Save Participant</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddParticipant;
