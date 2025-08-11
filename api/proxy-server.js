import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,  // disabilita parsing automatico del body
  },
};

export default async function handler(req, res) {
  // Gestione CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // URL reale dell'API PlantNet (modifica con il tuo endpoint vero)
    const plantNetUrl = "https://plantnet-api-url/identify";

    // Per inoltrare il body raw devi raccoglierlo manualmente, poiché bodyParser è disabilitato
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    // Inoltra la richiesta a PlantNet
    const response = await fetch(plantNetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "",
        // aggiungi qui eventuali header come API key se serve
      },
      body: rawBody.length > 0 ? rawBody : null,
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Proxy error" });
  }
}
