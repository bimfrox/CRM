import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ Authentication
import clientRoutes from "./routes/clientRoutes.js";

const app = express();
app.use(cors({
  origin: [ 
    "http://localhost:5173",          // ✅ local frontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ fixed
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
mongoose
  .connect("mongodb+srv://bimfrox_db_user:54kJctzM4QDMbdH2@cluster0.pxefzzz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes); // ✅ new auth route
app.use("/api/clients", clientRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 CRM Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

