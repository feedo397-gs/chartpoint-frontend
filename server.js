// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend files

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// --- Schemas ---
const shopSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  categories: [String],
  rating: Number,
});

const orderSchema = new mongoose.Schema({
  userId: String,
  shop: String,
  items: [{ itemName: String, quantity: Number, price: Number }],
  total: Number,
  status: { type: String, default: "pending" },
  date: { type: Date, default: Date.now },
});

const Shop = mongoose.model("Shop", shopSchema);
const Order = mongoose.model("Order", orderSchema);

// --- Routes ---
// Test route
app.get("/api", (req, res) => {
  res.send({ message: "Feedo API is running" });
});

// Get all shops
app.get("/api/shops", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders for a user
app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId });

    const current = orders.filter(o => o.status === "pending");
    const completed = orders.filter(o => o.status === "completed");

    res.json({ current, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark order as completed
app.patch("/api/orders/:orderId/complete", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: "completed" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Catch-all to serve frontend pages
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
