export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    res.status(200).json({ message: "Proxy-server is alive!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

