import express from "express";
import Client from "../models/Client.js";

const router = express.Router();

/**
 * ➡️ GET all clients
 */
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ➡️ ADD new client
 */
router.post("/", async (req, res) => {
  try {
    const {
      clientId,
      name,
      bname,
      contact,
      services,
      startDate,
      endDate,
      status,
      paymentStatus,
      totalAmount,
    } = req.body;

    const client = new Client({
      clientId,
      name,
      bname,
      contact,
      services,
      startDate,
      endDate,
      status,
      paymentStatus,
      totalAmount,
    });

    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * ➡️ UPDATE client (status / payment / anything)
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * ➡️ DELETE client
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
