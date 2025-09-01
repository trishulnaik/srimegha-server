import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Doctor from "../models/Doctor.js";

const router = Router();

router.post("/login", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  const { email, password } = parsed.data;
  const doc = await Doctor.findOne({ email });
  if (!doc) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, doc.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: doc._id, email: doc.email, name: doc.name }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, doctor: { id: doc._id, name: doc.name, email: doc.email } });
});

export default router;

