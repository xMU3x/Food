import { storageGet, storageSet } from "../../lib/storage.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    const existing = (await storageGet("orders")) || [];
    const updated = existing.filter((o) => o.id != id);
    await storageSet("orders", updated);

    return res.status(200).json({ ok: true, remaining: updated.length });
  } catch (err) {
    console.error("delete-order error:", err);
    return res.status(500).json({ error: err.message });
  }
}
