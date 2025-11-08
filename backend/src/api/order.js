import { connectToDB } from "../db.js";
import Order from "../models/Order.js";

export default async function handler(req, res) {
  await connectToDB(process.env.MONGO_URI);

  const { method } = req;

  if (method === "GET") {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const orders = await Order.find({ userId });
    const current = orders.filter(o => o.status === "pending");
    const completed = orders.filter(o => o.status === "completed");
    res.status(200).json({ current, completed });

  } else if (method === "POST") {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);

  } else if (method === "PATCH") {
    const orderId = req.query.orderId;
    if (!orderId) return res.status(400).json({ message: "Missing orderId" });

    const updated = await Order.findByIdAndUpdate(orderId, { status: "completed" }, { new: true });
    res.status(200).json(updated);

  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
