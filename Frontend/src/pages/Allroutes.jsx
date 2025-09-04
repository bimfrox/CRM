import React from "react";
import { Routes, Route } from "react-router-dom";

import List from "./List";
import Task from "./Task";
import Dashboard from "./Dashboard";
import Team from "./Team";
import Reminder from "./Reminder";
import Sidepanel from "./Sidepanel";
import Login from "./Login";

import { AuthProvider } from "../components/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import NotFound from "./NotFound";

const Allroutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* 🔹 Public Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Sidepanel />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="list" element={<List />} />
          <Route path="task" element={<Task />} />
          <Route path="team" element={<Team />} />
          <Route path="reminder" element={<Reminder />} />
        </Route>

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </AuthProvider>
  );
};

export default Allroutes;
