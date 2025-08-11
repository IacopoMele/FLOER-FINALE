import Busboy from "busboy";
import FormData from "form-data";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false, // disattiva il parsing automatico di Next.js
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const busboy = new Busboy({ headers: req.headers });
  const form = new FormData();

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(`Ricevuto file: ${filename} (${mimetype})`);
    form.append(fieldname, file, { filename, contentType: mimetype });
  });

  busboy.on("field", (fieldname, val) => {
    console.log(`Ricevuto campo: ${fieldname} = ${val}`);
    form.append(fieldname, val);
  });

  busboy.on("error", (err) => {
    console.error("Errore busboy:", err);
    res.status(500).json({ error: "Errore parsing form-data" });
  });

  busboy.on("finish", async () => {
    try {
      // Modifica qui con il vero endpoint API PlantNet
      const url = `https://my-api.plantnet.org/v2/identify/all?api-key=2b10S5uRUVldh2Pdamb7DYEu`;

      console.log("Invio richiesta a PlantNet...");

      const response = await fetch(url, {
        method: "POST",
        headers: form.getHeaders(),
        body: form,
      });

      const data = await response.json();

      console.log("Risposta da PlantNet ricevuta:", data);

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(response.status).json(data);
    } catch (err) {
      console.error("Errore nella fetch verso PlantNet:", err);
      res.status(500).json({ error: err.message || "Proxy error" });
    }
  });

  req.pipe(busboy);
}



