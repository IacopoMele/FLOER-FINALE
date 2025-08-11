export const config = {
  api: {
    bodyParser: false,  // Disabilitiamo il body parser automatico (importantissimo per upload immagini)
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Importante: leggiamo raw body (buffer) manualmente perché bodyParser è disabilitato
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    const plantNetUrl = "https://my-plantnet-api-endpoint/identify"; // Modifica con URL corretto

    const fetchResponse = await fetch(plantNetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        // aggiungi eventuali API key o authorization qui
      },
      body: rawBody.length > 0 ? rawBody : null,
    });

    const data = await fetchResponse.json();
    res.status(fetchResponse.status).json(data);

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message || "Proxy error" });
  }
}
