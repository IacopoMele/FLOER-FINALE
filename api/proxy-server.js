import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,  // disabilito il parsing automatico, se serve
  },
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = "";
  // Leggo il corpo raw (solo se bodyParser disabilitato)
  for await (const chunk of req) {
    body += chunk;
  }

  try {
  const plantNetUrl = "https://my-api.plantnet.org/identify";

    const response = await fetch(plantNetUrl, {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        // altri header se servono
      },
      body: body,
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Proxy error" });
  }
}

