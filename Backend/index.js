import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",               // local frontend
  "https://crm-panel-guj7.onrender.com",
  "https://crm-admin-75f8.onrender.com", // deployed frontend
];

// ✅ Strong CORS middleware (single source of truth)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ PATCH included
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Auto-handle preflight (OPTIONS) without overriding headers
app.options("*", cors());

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://bimfrox_db_user:54kJctzM4QDMbdH2@cluster0.pxefzzz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/teammember", teamRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 CRM Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
