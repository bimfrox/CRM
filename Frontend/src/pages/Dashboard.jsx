import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [leadsCount, setLeadsCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, teamRes, tasksRes] = await Promise.all([
          axios.get("http://localhost:5000/api/leads"),
          axios.get("http://localhost:5000/api/team"),
          axios.get("http://localhost:5000/api/tasks"),
        ]);

        setLeadsCount(leadsRes.data.length);
        setTeamCount(teamRes.data.length);
        setTasksCount(tasksRes.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "Leads", total: leadsCount },
    { name: "Team", total: teamCount },
    { name: "Tasks", total: tasksCount },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold">Total Leads</h2>
          <p className="text-2xl font-bold text-green-800">{leadsCount}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold">Team Members</h2>
          <p className="text-2xl font-bold text-blue-800">{teamCount}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold">Tasks</h2>
          <p className="text-2xl font-bold text-yellow-800">{tasksCount}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
