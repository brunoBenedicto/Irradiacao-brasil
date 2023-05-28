const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");

const port = process.env.PORT || 3000;
const locais = require("./src/locais/locais.json");

app.use(express.json({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get('/coordenadas', async (req, res) => {
  const { endereco } = req.query;

  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`);
    const data = response.data;

    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const listaLAT = locais.filter((item) => parseFloat(item.LAT).toFixed(1) == parseFloat(lat).toFixed(1));
      const itemEscolhido = listaLAT.findIndex((item) => parseFloat(item.LON).toFixed(1) == parseFloat(lon).toFixed(1));

      if (itemEscolhido !== -1) {
        const { ID, COUNTRY, ANNUAL, JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC } = listaLAT[itemEscolhido];
        const resultado = {
          ID,
          COUNTRY,
          LON: parseFloat(lon),
          LAT: parseFloat(lat),
          ANNUAL,
          JAN,
          FEB,
          MAR,
          APR,
          MAY,
          JUN,
          JUL,
          AUG,
          SEP,
          OCT,
          NOV,
          DEC,
          display_name
        };
        res.json(resultado);
      } else {
        res.status(404).json({ error: "Endereço não encontrado nos dados locais." });
      }
    } else {
      res.status(404).json({ error: "Endereço não encontrado na API do OpenStreetMap." });
    }
  } catch (error) {
    console.error("Erro ao obter as coordenadas:", error);
    res.status(500).json({ error: "Erro ao obter as coordenadas." });
  }
});

app.use(router);
app.listen(port, () => {
  console.log('Servidor rodando... ' + port);
});
