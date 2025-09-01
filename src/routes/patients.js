import { Router } from "express";
import { z } from "zod";
import Patient from "../models/Patient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const patientSchema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  dob:       z.string().optional(), // yyyy-mm-dd
  phone:     z.string().optional(),
  email:     z.string().email().optional(),
  notes:     z.string().optional()
});

// Create
router.post("/", async (req, res) => {
  const parsed = patientSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  const p = await Patient.create({
    ...parsed.data,
    dob: parsed.data.dob ? new Date(parsed.data.dob) : undefined,
    doctorId: req.user.id
  });
  res.status(201).json(p);
});

// List (with search + pagination)
router.get("/", async (req, res) => {
  const { q = "", page = 1, limit = 10 } = req.query;
  const filter = { doctorId: req.user.id };
  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [{ firstName: regex }, { lastName: regex }, { phone: regex }];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Patient.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
    Patient.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// Get by id
router.get("/:id", async (req, res) => {
  const p = await Patient.findOne({ _id: req.params.id, doctorId: req.user.id });
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// Update
router.put("/:id", async (req, res) => {
  const parsed = patientSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  const updates = { ...parsed.data };
  if (updates.dob) updates.dob = new Date(updates.dob);

  const p = await Patient.findOneAndUpdate(
    { _id: req.params.id, doctorId: req.user.id },
    updates,
    { new: true }
  );
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

export default router;

