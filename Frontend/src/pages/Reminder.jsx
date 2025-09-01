import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CheckCircle2, Clock, Trash2 } from "lucide-react";

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", time: "", type: "Call" });

  // ✅ Fetch reminders from backend
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await axios.get("https://crm-8sf1.onrender.com/api/reminders");
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add new reminder
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) return;
    try {
      await axios.post("https://crm-8sf1.onrender.com/api/reminders", form);
      setForm({ title: "", date: "", time: "", type: "Call" });
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Mark reminder as done
  const handleDone = async (id) => {
    try {
      await axios.put(`https://crm-8sf1.onrender.com/api/reminders/${id}`, { status: "Completed" });
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete reminder
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://crm-8sf1.onrender.com/api/reminders/${id}`);
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="text-green-600" /> Reminders
      </h2>

      {/* Add Reminder Form */}
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white shadow-md p-4 rounded-lg mb-6"
      >
        <input
          type="text"
          name="title"
          placeholder="Reminder Title"
          value={form.title}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        >
          <option>Call</option>
          <option>Meeting</option>
          <option>Task</option>
          <option>Payment</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700"
        >
          Add
        </button>
      </form>

      {/* Reminder List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reminders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No reminders yet.
                </td>
              </tr>
            ) : (
              reminders.map((reminder) => (
                <tr key={reminder._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{reminder.title}</td>
                  <td className="p-3">{reminder.date}</td>
                  <td className="p-3">{reminder.time}</td>
                  <td className="p-3">{reminder.type}</td>
                  <td className="p-3">
                    {reminder.status === "Completed" ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={16} /> Done
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold flex items-center gap-1">
                        <Clock size={16} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3 flex gap-3">
                    {reminder.status !== "Completed" && (
                      <button
                        onClick={() => handleDone(reminder._id)}
                        className="text-green-600 hover:underline"
                      >
                        Mark Done
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reminder;
