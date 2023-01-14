const express = require("express");
const app = express();
const router = express.Router()
const port = process.env.PORT || 3000;
const locais = require("./src/locais/locais.json")

app.use(express.json({extended: true}))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
router.get('/coordenadas', (req, res)=>{
    const {LON, LAT} = req.query
        console.log(LON + '  ' + LAT)
    const listaLAT =locais.filter((item)=>parseFloat(item.LAT).toFixed(1) == parseFloat(LAT).toFixed(1))
    const itemEscolhido = listaLAT.findIndex((item)=>parseFloat(item.LON).toFixed(1) == parseFloat(LON).toFixed(1))
        console.log(listaLAT[itemEscolhido].LAT +' ' + parseFloat(LAT).toFixed(1)+' '+LAT)
    res.json(listaLAT[itemEscolhido])
})

app.use(router)
app.listen(port, ()=>{
    console.log('Servidor rodando... ' + port)
})

