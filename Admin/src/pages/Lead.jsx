// frontend/src/pages/Lead.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Lead() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    whatsapp: "",
    source: "",
    industry: "",
    address: "",
    status: "New",
  });
  const [updatingId, setUpdatingId] = useState(null); // to disable select while updating

  // point this to your deployed backend (or local during dev)
  const API_URL = "https://crm-8sf1.onrender.com/api/leads";

  // fetch leads
  const fetchLeads = async () => {
    try {
      const res = await axios.get(API_URL);
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Optimistic status change
  const handleStatusChange = async (id, newStatus) => {
    // remember previous status to revert on error
    const prevStatus = leads.find((l) => l._id === id)?.status;

    // optimistic UI update
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l)));
    setUpdatingId(id);

    try {
      const res = await axios.patch(`${API_URL}/${id}/status`, { status: newStatus }, {
        headers: { "Content-Type": "application/json" },
      });

      // replace with authoritative response (contains updated doc)
      setLeads((prev) => prev.map((l) => (l._id === id ? res.data : l)));
    } catch (err) {
      console.error("Status update failed:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to update status");
      // revert
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status: prevStatus } : l)));
    } finally {
      setUpdatingId(null);
    }
  };

  // Import CSV
  const importCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/import`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchLeads();
      alert(`Imported ${res.data.count} leads`);
    } catch (err) {
      console.error("Error importing CSV", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "CSV import failed");
    }
  };

  // Export CSV
  const exportCSV = async () => {
    try {
      const res = await axios.get(`${API_URL}/export`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting CSV", err?.response?.data || err.message);
      alert("Export failed");
    }
  };

  // Add lead
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newLead);
      setShowModal(false);
      setNewLead({
        name: "",
        phone: "",
        email: "",
        whatsapp: "",
        source: "",
        industry: "",
        address: "",
        status: "New",
      });
      fetchLeads();
    } catch (err) {
      console.error("Error adding lead", err?.response?.data || err.message);
      alert("Failed to add lead");
    }
  };

  // Filter logic
  const filteredLeads = leads.filter((lead) => {
    const matchesName = lead.name?.toLowerCase().includes(search.toLowerCase());
    const matchesDate = filterDate
      ? new Date(lead.createdAt).toISOString().slice(0, 10) === filterDate
      : true;
    return matchesName && matchesDate;
  });

  const countByStatus = (status) => leads.filter((l) => l.status === status).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>

      {/* summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-xl text-center">
          <div className="text-sm">Total Leads</div>
          <div className="text-2xl font-semibold">{leads.length}</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl text-center">
          <div className="text-sm">In-progress</div>
          <div className="text-2xl font-semibold">{countByStatus("In-progress")}</div>
        </div>
        <div className="bg-green-100 p-4 rounded-xl text-center">
          <div className="text-sm">Converted</div>
          <div className="text-2xl font-semibold">{countByStatus("Converted")}</div>
        </div>
        <div className="bg-red-100 p-4 rounded-xl text-center">
          <div className="text-sm">Lost</div>
          <div className="text-2xl font-semibold">{countByStatus("Lost")}</div>
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." className="p-2 border rounded w-full md:w-1/3" />
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="p-2 border rounded" />
        <label className="px-4 py-2 bg-purple-600 text-white rounded cursor-pointer">
          Import CSV
          <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
        </label>
        <button onClick={exportCSV} className="px-4 py-2 bg-blue-600 text-white rounded">Export CSV</button>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-green-600 text-white rounded">Add Lead</button>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold">{lead.name}</h4>
              <span className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mt-2 text-sm text-gray-700">
              <div>📞 {lead.phone || "-"}</div>
              <div>✉️ {lead.email || "-"}</div>
              {lead.whatsapp && <div>💬 {lead.whatsapp}</div>}
              <div>🏠 {lead.address || "-"}</div>
              <div>🌍 {lead.source || "-"}</div>
              <div>🏢 {lead.industry || "-"}</div>
            </div>

            <div className="mt-3">
              <label className="text-sm">Status: </label>
              <select
                disabled={updatingId === lead._id}
                value={lead.status}
                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                className="ml-2 p-1 border rounded"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In-progress">In-progress</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
              {updatingId === lead._id && <span className="text-xs text-gray-500 ml-2">Updating...</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-3">
              <input required value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} placeholder="Name" className="w-full p-2 border rounded" />
              <input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} placeholder="Phone" className="w-full p-2 border rounded" />
              <input value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} placeholder="Email" className="w-full p-2 border rounded" />
              <input value={newLead.whatsapp} onChange={(e) => setNewLead({ ...newLead, whatsapp: e.target.value })} placeholder="WhatsApp" className="w-full p-2 border rounded" />
              <input value={newLead.address} onChange={(e) => setNewLead({ ...newLead, address: e.target.value })} placeholder="Address" className="w-full p-2 border rounded" />
              <input value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} placeholder="Source" className="w-full p-2 border rounded" />
              <input value={newLead.industry} onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })} placeholder="Industry" className="w-full p-2 border rounded" />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
