import express from "express";
import Reminder from "../models/Reminder.js";

const router = express.Router();

/* ===============================
   CONTROLLER FUNCTIONS
   =============================== */

// Create a new reminder
const createReminder = async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all reminders
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
    
// Get a reminder by ID
const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a reminder by ID
const updateReminder = async (req, res) => {
  try {
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReminder) return res.status(404).json({ message: "Reminder not found" });
    res.json(updatedReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a reminder by ID
const deleteReminder = async (req, res) => {
  try {
    const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!deletedReminder) return res.status(404).json({ message: "Reminder not found" });
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   ROUTES
   =============================== */
router.post("/", createReminder);
router.get("/", getReminders);
router.get("/:id", getReminderById);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

export default router;
