import { storageGet } from "../../lib/storage.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await storageGet("prices-config");
    return res.status(200).json(data || {});
  } catch (err) {
    console.error("get-prices error:", err);
    return res.status(500).json({});
  }
}
