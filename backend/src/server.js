import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexHandler from "./api/index.js";
import shopsHandler from "./api/shops.js";
import ordersHandler from "./api/orders.js";
import usersHandler from "./api/users.js";
import { connectToDB } from "./db.js";

dotenv.config();
const app = express();

// CORS for frontend
app.use(cors({
  origin: ["https://app-eta-eosin.vercel.app"], // Replace with your frontend URL
  methods: ["GET","POST","PATCH","PUT","DELETE","OPTIONS"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
connectToDB(process.env.MONGO_URI);

// API routes
app.use("/api", (req, res) => {
  if (req.path === "/" || req.path === "/index") return indexHandler(req, res);
  if (req.path.startsWith("/shops")) return shopsHandler(req, res);
  if (req.path.startsWith("/orders")) return ordersHandler(req, res);
  if (req.path.startsWith("/users")) return usersHandler(req, res);
  return res.status(404).json({ message: "API route not found" });
});

// Local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
