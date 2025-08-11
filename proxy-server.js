
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const upload = multer();

const PLANTNET_API_KEY = '2b10S5uRUVldh2Pdamb7DYEu';

// Abilita CORS solo per il tuo dominio GitHub Pages
app.use(cors({
  origin: 'https://iacopomele.github.io'
}));

app.post('/identify', upload.single('images'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const formData = new FormData();
    formData.append('organs', req.body.organs || 'flower');
    formData.append('images', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`,
      {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).json({ error: 'Proxy server error' });
  }
});

// Render usa process.env.PORT, non una porta fissa
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
