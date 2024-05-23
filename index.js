// Importações dos módulos
require("dotenv").config();
const db = require("./db/db");
const express = require("express");
const handlebars = require("express-handlebars");

// Instanciação dp servidor
const app = express();

// Vinculação do Handlebars ao Express
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Configurações no express para facilitar a captura de dados recebidos de formulários
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Usuario
const Usuario = require("./models/Usuario");

app.get("/usuarios/novo", (req, res) => {
  res.render("new-user");
});

app.post("/usuarios/novo", async (req, res) => {
  const dadosUsuarios = {
    nickname: req.body.nickname,
    nome: req.body.nome,
  };

  const usuario = await Usuario.create(dadosUsuarios);
  res.send("Usuário Inserido:" + usuario.id);
});

// Jogo
const Jogos = require("./models/Jogos");

app.get("/jogo/novo", (req, res) => {
  res.render("formJogo");
});

app.post("/jogo/novo", async (req, res) => {
  const dadosJogos = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precoBase: req.body.precoBase,
  };
  try {
    const jogo = await Jogos.create(dadosJogos);
    res.send("Jogo Inserido:" + jogo.id);
  } catch (error) {
    res.status(500).send("Erro ao inserir jogo: " + error.message);
  }
});

app.listen(3000);

db.sync()
  .then(() => {
    console.log("Sucesso, conectado e sicronizado ao bando de dados !!!");
  })
  .catch((err) => {
    console.log("Erro identificado: " + err);
  });
