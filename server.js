// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Import DB connection
require("./db"); // <-- ensures MongoDB connects

// Models
const User = require("./models/user");
const Item = require("./models/item");
const Order = require("./models/order");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// ====== AUTH ROUTES ======
app.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password)
      return res.json({ success: false, message: "All fields required" });

    const existing = await User.findOne({ phone });
    if (existing) return res.json({ success: false, message: "Phone already registered" });

    const user = new User({ name, phone, password });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone, password });
    if (!user) return res.json({ success: false, message: "Invalid credentials" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ====== ITEM ROUTES ======
app.post("/add-item", async (req, res) => {
  try {
    const { shopName, itemName, description, amount, imageUrl } = req.body;
    const item = new Item({ shopName, itemName, description, amount, imageUrl });
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/shops", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ====== ORDER ROUTES ======
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.userId });
    const current = orders.filter(o => o.status !== "Delivered");
    const completed = orders.filter(o => o.status === "Delivered");
    res.json({ current, completed });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.patch("/api/orders/:id/complete", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: "Delivered" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ====== START SERVER ======
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
