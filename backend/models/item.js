import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  itemName: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  imageUrl: String,
});

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
