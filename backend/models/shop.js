// models/Shop.jsimport mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  categories: [String],
  rating: Number
});

export default mongoose.models.Shop || mongoose.model("Shop", shopSchema);
