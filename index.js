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

// ROTAS
// HOME
app.get("/", (req, res) => {
  res.render("home");
});

// Usuario
app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll({ raw: true });

  res.render("usuarios", { usuarios });
});

// Usuario/novo
const Usuario = require("./models/Usuario");

app.get("/usuarios/novo", (req, res) => {
  res.render("formUsuarios");
});

app.post("/usuarios/novo", async (req, res) => {
  const dadosUsuarios = {
    nickname: req.body.nickname,
    nome: req.body.nome,
  };

  const usuario = await Usuario.create(dadosUsuarios);
  res.send("Usuário Inserido:" + usuario.id);
});

app.get("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formUsuarios", { usuario });
  // const id = parseInt(req.params.id);
  // const usuario = Usuario.findOne({
  //   where: { id: id },
  //   raw: true,
  // });
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

app.listen(3000, () => {
  console.log("O server está rodando na porta 3000");
});

db.sync()
  .then(() => {
    console.log("Sucesso, conectado e sicronizado ao bando de dados !!!");
  })
  .catch((err) => {
    console.log("Erro identificado: " + err);
  });
