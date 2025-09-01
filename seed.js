import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Doctor from "./src/models/Doctor.js";

await mongoose.connect(process.env.MONGO_URI);
const email = "doc@example.com";
const password = "Password123";
const name = "Dr. Demo";

const hash = await bcrypt.hash(password, 10);
await Doctor.deleteOne({ email });
await Doctor.create({ email, name, passwordHash: hash });
console.log("Doctor created:", email, "password:", password);
await mongoose.disconnect();

