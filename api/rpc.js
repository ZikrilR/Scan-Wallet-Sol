export default async function handler(req, res) {
  // CORS for browser clients on Vercel [web:332]
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const method = body?.method;

  // Hard whitelist: only allow the 2 methods we need (security)
  const ALLOWED = new Set(["getSignaturesForAddress", "getTransaction"]);
  if (!ALLOWED.has(method)) return res.status(403).json({ error: "RPC method not allowed" });

  const RPC = "https://api.mainnet-beta.solana.com"; // public endpoint [web:248]

  try {
    const r = await fetch(RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    res.status(r.status).setHeader("Content-Type", "application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
