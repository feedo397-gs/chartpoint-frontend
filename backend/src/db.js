import mongoose from "mongoose";

export async function connectToDB(uri) {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
