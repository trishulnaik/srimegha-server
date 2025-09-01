import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/", (_, res) => res.send("API OK"));
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server on :${PORT}`));
});
