// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ordersHandler from "./api/orders.js";
import shopsHandler from "./api/shops.js";
import indexHandler from "./api/index.js";
import { connectToDB } from "./db.js";  // ✅ fixed path

dotenv.config();
const app = express();

// ✅ Allow your frontend domain (Vercel frontend) for CORS
app.use(
  cors({
    origin: ["https://app-eta-eosin.vercel.app"], // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to MongoDB
connectToDB(process.env.MONGO_URI);

// ✅ API routes
app.use("/api", (req, res) => {
  if (req.path === "/" || req.path === "/index") return indexHandler(req, res);
  else if (req.path.startsWith("/orders")) return ordersHandler(req, res);
  else if (req.path.startsWith("/shops")) return shopsHandler(req, res);
  else return res.status(404).json({ message: "API route not found" });
});

// ✅ Only run locally (Vercel will handle production server)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
