import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.join(process.cwd(), "data", "team.json");

// ✅ Utility: Read JSON
const readTeam = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// ✅ Utility: Write JSON
const writeTeam = (team) => {
  fs.writeFileSync(filePath, JSON.stringify(team, null, 2));
};

// 🔹 Get all members
router.get("/", (req, res) => {
  const team = readTeam();
  res.json(team);
});

// 🔹 Add member
router.post("/", (req, res) => {
  const { name, role, email, image, phone } = req.body; // ✅ include phone

  if (!name || !role || !email || !image || !phone) {
    return res.status(400).json({ error: "All fields required" });
  }

  const team = readTeam();
  const newMember = {
    id: Date.now(),
    name,
    role,
    email,
    image, // can be base64 or URL
    phone,
  };

  team.push(newMember);
  writeTeam(team);

  res.json(newMember);
});

// 🔹 Delete member
router.delete("/:id", (req, res) => {
  const team = readTeam();
  const updatedTeam = team.filter((m) => m.id !== parseInt(req.params.id));
  writeTeam(updatedTeam);
  res.json({ message: "Member deleted" });
});

export default router;
