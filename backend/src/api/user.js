import { connectToDB } from "../db.js";
import User from "../models/User.js";

export default async function handler(req, res) {
  await connectToDB(process.env.MONGO_URI);

  if (req.method === "POST") {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) 
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, phone, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
