import React, { useState, useEffect } from "react";
import axios from "axios";

const Team = () => {
  const [team, setTeam] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    image: "",
  });
  const [showModal, setShowModal] = useState(false);

  // Fetch team from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/team").then((res) => setTeam(res.data));
  }, []);

  // Convert file → Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add member
  const addMember = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/team", formData);
      setTeam([...team, res.data]);
      setFormData({ name: "", role: "", email: "", phone: "", image: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  // Delete member
  const deleteMember = async (id) => {
    await axios.delete(`http://localhost:5000/api/team/${id}`);
    setTeam(team.filter((m) => m.id !== id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">👥 Team Members</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800"
        >
          + Add Member
        </button>
      </div>

      {/* Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="p-4 border rounded-lg shadow bg-white flex flex-col items-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <h2 className="font-semibold text-lg">{member.name}</h2>
            <p className="text-gray-600">{member.role}</p>
            <p className="text-gray-500 text-sm">{member.email}</p>
            <p className="text-gray-700 text-sm">📞 {member.phone}</p>
            <button
              onClick={() => deleteMember(member.id)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-green-800">
              ➕ Add Team Member
            </h2>
            <form onSubmit={addMember} className="space-y-4">
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
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
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
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover mt-2"
                />
              )}
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
