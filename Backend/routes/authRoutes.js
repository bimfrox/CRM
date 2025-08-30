import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

// 🔹 Fixed admin credentials
const FIXED_USERNAME = "admin";
const FIXED_PASSWORD = "123456";
const SECRET_KEY = "supersecretjwt";

let otpStore = {}; // { email: otp }

// 🔹 Login Route
router.post("/login", async (req, res) => {
  const { username, password, email } = req.body;

  if (username !== FIXED_USERNAME || password !== FIXED_PASSWORD) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  // Send OTP email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amaurya64566@gmail.com",
      pass: "zszdnukxpubcgirg", // Gmail App Password
    },
  });

  await transporter.sendMail({
    from: "amaurya64566@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  });

  res.json({ success: true, message: "OTP sent to email" });
});

// 🔹 Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  delete otpStore[email]; // Clear OTP after use

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ success: true, token });
});

export default router;
