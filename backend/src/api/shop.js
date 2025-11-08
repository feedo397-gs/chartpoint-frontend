import { connectToDB } from "../db.js";
import Shop from "../models/Shop.js";

export default async function handler(req, res) {
  await connectToDB(process.env.MONGO_URI);

  if (req.method === "GET") {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
