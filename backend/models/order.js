import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shop: String,
  items: Array,
  total: Number,
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
  customerName: String,
  customerPhone: String,
  address: String,
  customerId: String,
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
