import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  name:  { type: String, required: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);

