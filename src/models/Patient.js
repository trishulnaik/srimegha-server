import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true, index: true },
  lastName:  { type: String, required: true, index: true },
  dob:       { type: Date },
  phone:     { type: String, index: true },
  email:     { type: String },
  notes:     { type: String },
  lastVisit: { type: Date },
  // link record to the doctor who created/owns it
  doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }
}, { timestamps: true });

// Useful compound index for search
patientSchema.index({ doctorId: 1, lastName: 1, firstName: 1 });
patientSchema.index({ doctorId: 1, phone: 1 });

export default mongoose.model("Patient", patientSchema);

