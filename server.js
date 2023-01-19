const express = require("express");
const app = express();
const multer  = require('multer')
const filessystem = require('fs');
const upload = multer({storage:multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/uploads/")

    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})})


var pastaPublic = './public';
if (!filessystem.existsSync(pastaPublic)){
    filessystem.mkdirSync(pastaPublic);
}else
{
    console.log("pasta não criada");
}

var pastaUpload = './public/uploads/';
if (!filessystem.existsSync(pastaUpload)){
    filessystem.mkdirSync(pastaUpload);
}else
{
    console.log("pasta não criada");
}


const cors = require("cors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


const banco = [];

app.get("/", (req, res) => {
  res.status(200).json(banco);
});

app.get("/:id", (req, res) => {
  const dados = banco.find((x) => x.id === parseInt(req.params.id));
  if (dados) {
    res.status(200).json(dados);
  } else {
    res.status(401).json({ resource: "not found" });
  }
});

app.post("/",upload.single("anexo"),(req, res) => {
  const dados = req.body;
  dados.id = banco.length + 1;
  dados.data = new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"});
  dados.anexo = req.file.originalname;
  banco.push(dados);
  res.status(201).json(dados);
});

app.put("/:id", (req, res) => {
    const id = parseInt(req.params.id) - 1;
    const dados = req.body;
    dados.id = parseInt(req.params.id);
    banco[id] = dados;
    res.status(201).json(dados);
});

app.delete("/:id",(req,res)=>{
    const id = parseInt(req.params.id) - 1;
    banco.splice(id,1);
    res.status(200).json(banco);
})

app.listen(port, (err) => {
  if (err) console.error(err.message);
  console.log("http://localhost:3000");
});