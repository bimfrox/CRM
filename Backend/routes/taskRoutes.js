import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// ✅ Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ✅ Add task
router.post("/", async (req, res) => {
  try {
    const { name, message, date, status } = req.body;

    if (!name || !date) {
      return res.status(400).json({ error: "Name and Date are required" });
    }

    const task = new Task({
      name,
      message,
      date,
      status: status || "new",
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

// ✅ Update task (can update status, name, message, date)
router.put("/:id", async (req, res) => {
  try {
    const { name, message, date, status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { name, message, date, status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// ✅ Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
