import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addIntroRegistration,
  deleteIntroRegistration,
  getAllIntroRegistrations,
  updateIntroRegistration,
} from "../../utils/introRegistrationStorage";
import type {
  IntroAttendance,
  IntroRegistration,
  IntroReminder,
  IntroSignUp,
  PaymentMethod,
} from "../../mock/introRegistrations";

type IntroFormData = Omit<IntroRegistration, "id">;

const reminderOptions: IntroReminder[] = [
  "Confirmed",
  "1W Reminder",
  "3D Reminder",
  "1D Reminder",
  "D Reminder",
  "Cancelled",
];

const attendanceOptions: IntroAttendance[] = ["Yes", "No"];
const signUpOptions: IntroSignUp[] = ["Yes", "No"];

const paymentMethodOptions: PaymentMethod[] = [
  "Cash",
  "GCash",
  "Bank Transfer",
  "Credit Card",
];

const defaultFormData: IntroFormData = {
  email: "",
  name: "",
  relationshipWithChildren: "",
  numberOfChildren: 1,
  children: [],
  totalPax: 1,
  contactNo: "",
  cityOfPreview: "",
  signUpDate: "",
  introSessionDate: "",
  registration: "",
  reminder: "Confirmed",
  attendance: "No",
  ads: "",
  noResponses: false,
  responded: false,
  confirmed: false,
  totalLeads: 1,
  remarks: "",
  signUp: "No",
  signUpPax: 0,
  paymentMethod: "Cash",
};

const IntroRegistrations = () => {
  const navigate = useNavigate();
  const { country, city } = useParams();
  const activePreviewLocation =
    country === "indo"
      ? "Indo"
      : country === "singapore"
        ? "Singapore"
        : city === "cebu"
          ? "Cebu"
          : city === "davao"
            ? "Davao"
            : "Manila";

  const [introRegistrations, setIntroRegistrations] = useState<
    IntroRegistration[]
  >(getAllIntroRegistrations());

  const [searchTerm, setSearchTerm] = useState("");
  const [reminderFilter, setReminderFilter] = useState<"All" | IntroReminder>(
    "All",
  );
  const [attendanceFilter, setAttendanceFilter] = useState<
    "All" | IntroAttendance
  >("All");
  const [signUpFilter, setSignUpFilter] = useState<"All" | IntroSignUp>("All");

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IntroRegistration | null>(
    null,
  );
  const [formData, setFormData] = useState<IntroFormData>(defaultFormData);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] =
    useState<IntroRegistration | null>(null);

  const filteredIntroRegistrations = useMemo(() => {
    return introRegistrations.filter((record) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesPreviewCity = record.cityOfPreview === activePreviewLocation;
      const matchesSearch =
        record.name.toLowerCase().includes(searchValue) ||
        record.email.toLowerCase().includes(searchValue) ||
        record.contactNo.toLowerCase().includes(searchValue) ||
        record.cityOfPreview.toLowerCase().includes(searchValue) ||
        record.remarks.toLowerCase().includes(searchValue);

      const matchesReminder =
        reminderFilter === "All" || record.reminder === reminderFilter;

      const matchesAttendance =
        attendanceFilter === "All" || record.attendance === attendanceFilter;

      const matchesSignUp =
        signUpFilter === "All" || record.signUp === signUpFilter;

      return (
        matchesPreviewCity &&
        matchesSearch &&
        matchesReminder &&
        matchesAttendance &&
        matchesSignUp
      );
    });
  }, [
    introRegistrations,
    searchTerm,
    reminderFilter,
    attendanceFilter,
    signUpFilter,
    activePreviewLocation,
  ]);

  const refreshIntroRegistrations = () => {
    setIntroRegistrations(getAllIntroRegistrations());
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingRecord(null);
    setError("");
    setShowForm(false);
  };
  const handleAddClick = () => {
    setFormData({
      ...defaultFormData,
      cityOfPreview: activePreviewLocation,
    });
    setEditingRecord(null);
    setError("");
    setShowForm(true);
  };

  const handleEditClick = (record: IntroRegistration) => {
    setEditingRecord(record);
    setFormData({
      email: record.email,
      name: record.name,
      relationshipWithChildren: record.relationshipWithChildren,
      numberOfChildren: record.numberOfChildren,
      children: record.children,
      totalPax: record.totalPax,
      contactNo: record.contactNo,
      cityOfPreview: record.cityOfPreview,
      signUpDate: record.signUpDate,
      introSessionDate: record.introSessionDate,
      registration: record.registration,
      reminder: record.reminder,
      attendance: record.attendance,
      ads: record.ads,
      noResponses: record.noResponses,
      responded: record.responded,
      confirmed: record.confirmed,
      totalLeads: record.totalLeads,
      remarks: record.remarks,
      signUp: record.signUp,
      signUpPax: record.signUpPax,
      paymentMethod: record.paymentMethod,
    });
    setError("");
    setShowForm(true);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Name is required.";
    }

    if (!formData.contactNo.trim()) {
      return "Contact number is required.";
    }

    if (!formData.cityOfPreview.trim()) {
      return "City of Preview is required.";
    }

    if (!formData.signUpDate) {
      return "Sign Up Date is required.";
    }

    if (!formData.introSessionDate) {
      return "Intro Session Date is required.";
    }

    if (!formData.reminder) {
      return "Reminder is required.";
    }

    if (!formData.attendance) {
      return "Attendance is required.";
    }

    return "";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (editingRecord) {
      updateIntroRegistration({
        id: editingRecord.id,
        ...formData,
      });
    } else {
      addIntroRegistration(formData);
    }

    refreshIntroRegistrations();
    resetForm();
  };

  const handleDeleteClick = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this introductory registration?",
    );

    if (!confirmed) {
      return;
    }

    deleteIntroRegistration(id);
    refreshIntroRegistrations();
  };

  const handleRegisterToCamp = (id: number) => {
    navigate(`/participants/new?introId=${id}`);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold mb-1">Preview - {activePreviewLocation}</h1>{" "}
          <p className="text-muted mb-0">
            Manage parent leads, intro session attendance, and camp sign-up
            interest.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAddClick}>
          <i className="bi bi-plus-lg me-2"></i>
          Add Preview Registration{" "}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">
              {editingRecord
                ? "Edit Intro Registration"
                : "Add Intro Registration"}
            </h5>
          </div>

          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Contact No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.contactNo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactNo: e.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">
                    City of Preview
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.cityOfPreview}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cityOfPreview: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">
                    Payment Method
                  </label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as PaymentMethod,
                      })
                    }
                  >
                    {paymentMethodOptions.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Total Pax</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={formData.totalPax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalPax: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Total Leads</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={formData.totalLeads}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalLeads: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Sign Up Pax</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={formData.signUpPax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        signUpPax: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Sign Up</label>
                  <select
                    className="form-select"
                    value={formData.signUp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        signUp: e.target.value as IntroSignUp,
                      })
                    }
                  >
                    {signUpOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Sign Up Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.signUpDate}
                    onChange={(e) =>
                      setFormData({ ...formData, signUpDate: e.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">
                    Intro Session Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.introSessionDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        introSessionDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Attendance</label>
                  <select
                    className="form-select"
                    value={formData.attendance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attendance: e.target.value as IntroAttendance,
                      })
                    }
                  >
                    {attendanceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Reminder</label>
                  <select
                    className="form-select"
                    value={formData.reminder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reminder: e.target.value as IntroReminder,
                      })
                    }
                  >
                    {reminderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">ADS</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.ads}
                    onChange={(e) =>
                      setFormData({ ...formData, ads: e.target.value })
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Registration</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.registration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Remarks</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="col-12">
                  <div className="d-flex flex-wrap gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="noResponses"
                        checked={formData.noResponses}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            noResponses: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="noResponses">
                        No Responses
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="responded"
                        checked={formData.responded}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            responded: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="responded">
                        Responded
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="confirmed"
                        checked={formData.confirmed}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmed: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="confirmed">
                        Confirmed
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {editingRecord ? "Save Changes" : "Save Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <label className="form-label fw-semibold">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search name, email, contact, city, or remarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-4 col-lg-3">
              <label className="form-label fw-semibold">Reminder</label>
              <select
                className="form-select"
                value={reminderFilter}
                onChange={(e) =>
                  setReminderFilter(e.target.value as "All" | IntroReminder)
                }
              >
                <option value="All">All</option>
                {reminderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4 col-lg-2">
              <label className="form-label fw-semibold">Attendance</label>
              <select
                className="form-select"
                value={attendanceFilter}
                onChange={(e) =>
                  setAttendanceFilter(e.target.value as "All" | IntroAttendance)
                }
              >
                <option value="All">All</option>
                {attendanceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4 col-lg-3">
              <label className="form-label fw-semibold">Sign Up</label>
              <select
                className="form-select"
                value={signUpFilter}
                onChange={(e) =>
                  setSignUpFilter(e.target.value as "All" | IntroSignUp)
                }
              >
                <option value="All">All</option>
                {signUpOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {selectedRecord && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Preview Details</h5>

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
                <small className="text-muted">Name of Guardian</small>
                <div className="fw-semibold">{selectedRecord.name}</div>
              </div>

              <div className="col-12 col-md-4">
                <small className="text-muted">
                  Relationship with the child/ren
                </small>
                <div className="fw-semibold">
                  {selectedRecord.relationshipWithChildren || "—"}
                </div>
              </div>

              <div className="col-12 col-md-4">
                <small className="text-muted">Number of child/ren</small>
                <div className="fw-semibold">
                  {selectedRecord.numberOfChildren}
                </div>
              </div>
            </div>

            <h6 className="fw-bold mb-3">Information of child</h6>

            <div className="table-responsive">
              <table className="table table-sm table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>School</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedRecord.children.length > 0 ? (
                    selectedRecord.children.map((child, index) => (
                      <tr key={`${child.name}-${index}`}>
                        <td>{child.name}</td>
                        <td>{child.school}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center text-muted">
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
                  <th className="ps-4">Name of Guardian</th>
                  <th>Relationship with the child/ren</th>
                  <th>Number of child/ren</th>
                  <th className="text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIntroRegistrations.length > 0 ? (
                  filteredIntroRegistrations.map((record) => (
                    <tr key={record.id}>
                      <td className="ps-4 fw-semibold">{record.name}</td>

                      <td>{record.relationshipWithChildren || "—"}</td>

                      <td>{record.numberOfChildren}</td>

                      <td className="text-center pe-4">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedRecord(record)}
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEditClick(record)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleRegisterToCamp(record.id)}
                          >
                            Register to Camp
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(record.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      {" "}
                      No introductory registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="text-muted mt-3 mb-0">
        Showing {filteredIntroRegistrations.length} of{" "}
        {introRegistrations.length} introductory registrations.
      </p>
    </div>
  );
};

export default IntroRegistrations;
