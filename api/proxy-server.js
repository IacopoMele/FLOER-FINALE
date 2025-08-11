import fetch from "node-fetch";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // URL API PlantNet (modifica con il tuo endpoint vero)
    const plantNetUrl = "https://my-plantnet-api-endpoint/identify";

    // Forward body e headers
    const response = await fetch(plantNetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        // eventuali header come API key, Authorization, ecc.
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : null,
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Proxy error" });
  }
}
