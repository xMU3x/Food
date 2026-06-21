import { storageSet } from "../../lib/storage.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await storageSet("orders", []);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("clear-orders error:", err);
    return res.status(500).json({ error: err.message });
  }
}
