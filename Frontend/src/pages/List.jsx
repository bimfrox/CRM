// frontend/src/pages/List.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaMoneyBillWave, FaPlus } from "react-icons/fa";

const List = () => {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    name: "",
    bname: "",
    contact: "",
    services: "",
    startDate: "",
    endDate: "",
    totalAmount: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await axios.get("https://crm-8sf1.onrender.com/api/clients");
      setClients(data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://crm-8sf1.onrender.com/api/clients", formData);
      setFormData({
        clientId: "",
        name: "",
        bname: "",
        contact: "",
        services: "",
        startDate: "",
        endDate: "",
        totalAmount: "",
      });
      setShowForm(false);
      fetchClients();
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  const updateClientField = async (id, field, value) => {
    try {
      await axios.put(`https://crm-8sf1.onrender.com/api/clients/${id}`, {
        [field]: value,
      });
      fetchClients();
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const filteredClients =
    filter === "All"
      ? clients
      : clients.filter((c) => c.status === filter || c.paymentStatus === filter);

  const totalProjects = clients.length;
  const totalPayments = clients.reduce(
    (sum, c) => sum + (c.totalAmount || 0),
    0
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Client Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FaPlus className="mr-2" /> {showForm ? "Close" : "Add Client"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center space-x-3">
            <FaUsers className="text-blue-600 text-3xl" />
            <div>
              <h3 className="font-medium text-gray-600">Total Projects</h3>
              <p className="text-2xl font-bold">{totalProjects}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center space-x-3">
            <FaMoneyBillWave className="text-green-600 text-3xl" />
            <div>
              <h3 className="font-medium text-gray-600">Total Payments</h3>
              <p className="text-2xl font-bold">₹{totalPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Add Client Form */}
      {showForm && (
        <form
          onSubmit={handleAddClient}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-6 bg-white border rounded-xl shadow"
        >
          <input
            type="text"
            placeholder="Client ID"
            value={formData.clientId}
            onChange={(e) =>
              setFormData({ ...formData, clientId: e.target.value })
            }
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Client Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Business Name"
            value={formData.bname}
            onChange={(e) =>
              setFormData({ ...formData, bname: e.target.value })
            }
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Services"
            value={formData.services}
            onChange={(e) =>
              setFormData({ ...formData, services: e.target.value })
            }
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Total Amount"
            value={formData.totalAmount}
            onChange={(e) =>
              setFormData({ ...formData, totalAmount: e.target.value })
            }
            className="border p-3 rounded-lg"
            required
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Save Client
          </button>
        </form>
      )}

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter:</label>
        <select
          className="border px-3 py-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active Projects</option>
          <option value="Completed">Completed</option>
          <option value="On-hold">On-hold</option>
          <option value="Pending">Payment Pending</option>
          <option value="Half Paid">Half Paid</option>
          <option value="Full Paid">Full Paid</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border">Client ID</th>
              <th className="p-3 border">Client Name</th>
              <th className="p-3 border">Business Name</th>
              <th className="p-3 border">Contact</th>
              <th className="p-3 border">Services</th>
              <th className="p-3 border">Duration</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((c) => (
              <tr
                key={c._id}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-3 border">{c.clientId}</td>
                <td className="p-3 border font-medium">{c.name}</td>
                <td className="p-3 border">{c.bname}</td>
                <td className="p-3 border">{c.contact}</td>
                <td className="p-3 border">{c.services}</td>
                <td className="p-3 border">
                  {new Date(c.startDate).toLocaleDateString()} -{" "}
                  {new Date(c.endDate).toLocaleDateString()}
                </td>
                <td
                  className="p-3 border cursor-pointer text-blue-600 font-semibold hover:underline"
                  onClick={() => {
                    const nextStatus =
                      c.status === "Active"
                        ? "Completed"
                        : c.status === "Completed"
                        ? "On-hold"
                        : "Active";
                    updateClientField(c._id, "status", nextStatus);
                  }}
                >
                  {c.status}
                </td>
                <td
                  className="p-3 border cursor-pointer text-green-600 font-semibold hover:underline"
                  onClick={() => {
                    const nextPayment =
                      c.paymentStatus === "Pending"
                        ? "Half Paid"
                        : c.paymentStatus === "Half Paid"
                        ? "Full Paid"
                        : "Pending";
                    updateClientField(c._id, "paymentStatus", nextPayment);
                  }}
                >
                  {c.paymentStatus}
                </td>
                <td className="p-3 border font-bold">₹{c.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
