import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  addLead,
  deleteLead,
  getAllLeads,
  updateLead,
} from "../../utils/leadStorage";
import type { Lead, LeadStatus } from "../../mock/leads";

type LeadFormData = Omit<Lead, "id">;

const leadStatuses: LeadStatus[] = [
  "Interested",
  "For Follow-up",
  "No Response",
  "Responded",
  "Not Interested",
  "Converted to Preview",
];

const defaultFormData: LeadFormData = {
  name: "",
  contactNo: "",
  email: "",
  source: "",
  status: "Interested",
  remarks: "",
};

const Leads = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>(getAllLeads());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | LeadStatus>("All");

  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<LeadFormData>(defaultFormData);
  const [error, setError] = useState("");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        lead.name.toLowerCase().includes(searchValue) ||
        lead.contactNo.toLowerCase().includes(searchValue) ||
        lead.email.toLowerCase().includes(searchValue) ||
        lead.source.toLowerCase().includes(searchValue) ||
        lead.remarks.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const refreshLeads = () => {
    setLeads(getAllLeads());
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingLead(null);
    setError("");
    setShowForm(false);
  };

  const handleAddClick = () => {
    setFormData(defaultFormData);
    setEditingLead(null);
    setError("");
    setShowForm(true);
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      contactNo: lead.contactNo,
      email: lead.email,
      source: lead.source,
      status: lead.status,
      remarks: lead.remarks,
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

    if (!formData.source.trim()) {
      return "Source is required.";
    }

    if (!formData.status) {
      return "Status is required.";
    }

    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (editingLead) {
      updateLead({
        id: editingLead.id,
        ...formData,
      });
    } else {
      addLead(formData);
    }

    refreshLeads();
    resetForm();
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmed) {
      return;
    }

    deleteLead(id);
    refreshLeads();
  };

  const handleConvertToPreview = (lead: Lead) => {
    updateLead({
      ...lead,
      status: "Converted to Preview",
    });

    refreshLeads();

    // V1 behavior:
    // Mark as converted, then send staff to Manila Preview.
    // Later, we can auto-fill Preview using leadId.
    navigate("/preview/philippines/manila");
  };

  const getStatusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case "Interested":
        return "bg-primary";
      case "For Follow-up":
        return "bg-warning text-dark";
      case "No Response":
        return "bg-secondary";
      case "Responded":
        return "bg-info text-dark";
      case "Not Interested":
        return "bg-danger";
      case "Converted to Preview":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold mb-1">Leads</h1>
          <p className="text-muted mb-0">
            Manage interested leads before converting them to Preview.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAddClick}>
          <i className="bi bi-plus-lg me-2"></i>
          Add Lead
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">
              {editingLead ? "Edit Lead" : "Add Lead"}
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
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Contact No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.contactNo}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        contactNo: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Source</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Facebook Ads, Referral, Walk-in..."
                    value={formData.source}
                    onChange={(event) =>
                      setFormData({ ...formData, source: event.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        status: event.target.value as LeadStatus,
                      })
                    }
                  >
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Remarks</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.remarks}
                    onChange={(event) =>
                      setFormData({ ...formData, remarks: event.target.value })
                    }
                  ></textarea>
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
                  {editingLead ? "Save Changes" : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search name, contact, email, source, or remarks..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-lg-3">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "All" | LeadStatus)
                }
              >
                <option value="All">All</option>
                {leadStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
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
                  <th className="ps-4">Name</th>
                  <th>Contact No.</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th className="text-center pe-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="ps-4 fw-semibold">{lead.name}</td>
                      <td>{lead.contactNo}</td>
                      <td>{lead.email || "—"}</td>
                      <td>{lead.source}</td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            lead.status,
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ minWidth: "220px" }}>
                        {lead.remarks || "—"}
                      </td>

                      <td className="text-center pe-4">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditClick(lead)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleConvertToPreview(lead)}
                            disabled={lead.status === "Converted to Preview"}
                          >
                            Convert to Preview
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(lead.id)}
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
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="text-muted mt-3 mb-0">
        Showing {filteredLeads.length} of {leads.length} leads.
      </p>
    </div>
  );
};

export default Leads;
