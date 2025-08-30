import React, { useState, useEffect } from "react";
import axios from "axios";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // ✅ Default to all
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });
  const [filterDate, setFilterDate] = useState(""); // ✅ Date filter

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const res = await axios.post("http://localhost:5000/api/tasks", {
        name: formData.name,
        message: formData.message,
        date: today,
        status: "new",
      });

      setTasks([...tasks, res.data]);
      setFormData({ name: "", message: "" });
      setShowModal(false);
      setActiveTab("new"); // ✅ Redirect to new
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Update task status
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        status,
      });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ✅ Filtered tasks based on tab + date
  const filteredTasks = tasks
    .filter((t) => (activeTab === "all" ? true : t.status === activeTab))
    .filter((t) => (filterDate ? t.date === filterDate : true));

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-green-800 text-center sm:text-left">
          Task Manager
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800"
        >
          + Add Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "new", "Panding", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg ${activeTab === tab
                ? "bg-green-700 text-white"
                : "bg-gray-200 text-gray-700"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 border rounded-lg w-full sm:w-auto"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="px-3 py-2 bg-gray-300 rounded-lg w-full sm:w-auto"
          >
            Clear
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="p-4 border rounded-lg shadow-sm bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              {/* Left side: task details */}
              <div>
                <h2 className="font-semibold text-lg">{task.name}</h2>
                <p className="text-gray-600">{task.message}</p>
              </div>

              {/* Right side: date + actions */}
              <div className="flex flex-col items-end gap-2">
                <p className="text-sm text-gray-500">📅 {task.date}</p>
                <div className="flex flex-wrap gap-2">
                  {task.status !== "completed" ? (
                    <>
                      {task.status !== "Panding" && (
                        <button
                          onClick={() => updateStatus(task._id, "Panding")}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg"
                        >
                          Pending
                        </button>
                      )}
                      {task.status !== "completed" && (
                        <button
                          onClick={() => updateStatus(task._id, "completed")}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md  bg-opacity-40">
          <div className=" bg-white backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-green-800 text-center">
              ➕ Add New Task
            </h2>
            <form onSubmit={addTask} className="space-y-4">
              <input
                type="text"
                placeholder="Task Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Task Details"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
