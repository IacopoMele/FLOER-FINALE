import FormData from "form-data";
import fetch from "node-fetch";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,  // importantissimo per gestire multipart/form-data raw
  },
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = "2b10S5uRUVldh2Pdamb7DYEu";  // la tua API key PlantNet
    const project = "all";  // progetto di default

    const url = `https://my-api.plantnet.org/v2/identify/${project}?api-key=${apiKey}`;

    const busboy = new Busboy({ headers: req.headers });
    const form = new FormData();

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      form.append(fieldname, file, { filename, contentType: mimetype });
    });

    busboy.on("field", (fieldname, val) => {
      form.append(fieldname, val);
    });

    busboy.on("finish", async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            ...form.getHeaders(),
          },
          body: form,
        });

        const data = await response.json();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(response.status).json(data);
      } catch (err) {
        res.status(500).json({ error: err.message || "Proxy error" });
      }
    });

    req.pipe(busboy);
  } catch (error) {
    res.status(500).json({ error: error.message || "Unexpected error" });
  }
}



