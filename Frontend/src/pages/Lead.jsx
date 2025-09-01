import React, { useState, useEffect } from "react";
import axios from "axios";

const Lead = () => {
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all / contacted / not_contacted

  // Fetch leads
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/leads")
      .then((res) => setLeads(res.data))
      .catch(console.error);
  }, []);

  // Add single lead
  const addLead = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/leads", {
        ...formData,
        contacted: false,
      });
      setLeads([...leads, res.data]);
      setFormData({ name: "", email: "", phone: "", source: "" });
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // CSV upload
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataCSV = new FormData();
    formDataCSV.append("file", file);

    try {
      const res = await axios.post(
        "https://crm-8sf1.onrender.com/api/leads/import",
        formDataCSV,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setLeads([...leads, ...res.data.data]);
    } catch (err) {
      console.error("CSV upload failed:", err);
    }
  };

  // Delete lead
  const deleteLead = async (id) => {
    await axios.delete(`https://crm-8sf1.onrender.com/api/leads/${id}`);
    setLeads(leads.filter((l) => l._id !== id));
  };

  // Toggle contacted
  const toggleContacted = async (id) => {
    const lead = leads.find((l) => l._id === id);
    if (!lead) return;
    const updatedLead = { ...lead, contacted: !lead.contacted };
    await axios.put(`https://crm-8sf1.onrender.com/api/leads/${id}`, updatedLead);
    setLeads(leads.map((l) => (l._id === id ? updatedLead : l)));
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (filter === "contacted") return lead.contacted;
    if (filter === "not_contacted") return !lead.contacted;
    return true;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-green-800">📋 Leads</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800"
          >
            + Add Lead
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="px-4 py-2 border rounded-lg cursor-pointer"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All</option>
            <option value="contacted">Reached / Contacted</option>
            <option value="not_contacted">Not Reached</option>
          </select>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredLeads.map((lead) => (
          <div
            key={lead._id}
            className="p-4 border rounded-lg shadow bg-white flex flex-col items-start"
          >
            <h2 className="font-semibold text-lg">{lead.name}</h2>
            <p className="text-gray-500 text-sm">{lead.email}</p>
            <p className="text-gray-700 text-sm">📞 {lead.phone}</p>
            <p className="text-gray-500 text-sm">Source: {lead.source}</p>

            {/* Contacted Checkbox */}
            <label className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={lead.contacted}
                onChange={() => toggleContacted(lead._id)}
              />
              Reached / Contacted
            </label>

            <button
              onClick={() => deleteLead(lead._id)}
              className="mt-3 px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Manual Add */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-green-800">➕ Add Lead</h2>
            <form onSubmit={addLead} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Source (where reached)"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-lg"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lead;
