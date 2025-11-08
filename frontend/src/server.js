// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ordersHandler from "./api/orders.js";
import shopsHandler from "./api/shops.js";
import indexHandler from "./api/index.js";
import { connectToDB } from "./db.js"; // ✅ Make sure db.js is in src/

dotenv.config();
const app = express();

// ✅ CORS setup (allow your Vercel frontend)
app.use(
  cors({
    origin: [
      "https://app-eta-eosin.vercel.app", // your Vercel frontend URL
      "http://localhost:3000", // optional: local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to MongoDB
connectToDB(process.env.MONGO_URI);

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ message: "Feedo backend is running ✅" });
});

// ✅ API routes
app.use("/api", (req, res) => {
  if (req.path === "/" || req.path === "/index") return indexHandler(req, res);
  else if (req.path.startsWith("/orders")) return ordersHandler(req, res);
  else if (req.path.startsWith("/shops")) return shopsHandler(req, res);
  else return res.status(404).json({ message: "API route not found" });
});

// ✅ Listen only when not in production (Render handles it automatically)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
