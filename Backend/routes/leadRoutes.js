import express from "express";
import Lead from "../models/Lead.js";
import multer from "multer";
import csv from "csvtojson";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 🔹 Get all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Add new lead
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, source, contacted } = req.body;
    if (!name || !email || !phone)
      return res.status(400).json({ error: "Name, email, phone are required" });

    const newLead = new Lead({ name, email, phone, source, contacted });
    await newLead.save();
    res.json(newLead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update lead (toggle contacted)
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    Object.assign(lead, req.body);
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Import leads via CSV
router.post("/import", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "CSV file required" });

  try {
    const jsonArray = await csv().fromFile(req.file.path);
    // Map CSV columns to Lead fields
    const leadsToInsert = jsonArray.map((row) => ({
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      source: row.source || "",
      contacted: false,
    }));

    const insertedLeads = await Lead.insertMany(leadsToInsert);
    res.json({ message: "CSV imported successfully", data: insertedLeads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
