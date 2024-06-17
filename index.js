// Importações dos módulos
require("dotenv").config();
const db = require("./db/db");
const express = require("express");
const handlebars = require("express-handlebars");

const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");

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
});

// Atualizar
app.post("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const dadosUsuarios = {
    nickname: req.body.nickname,
    nome: req.body.nome,
  };

  const retorno = await Usuario.update(dadosUsuarios, {
    where: { id: id },
  });

  if (retorno > 0) {
    res.redirect("/usuarios");
  } else {
    res.send("Erro ao atualizar usuário");
  }
});

// Delete
app.post("/usuarios/:id/delete", async (req, res) => {
  const id = parseInt(req.params.id);
  const retorno = await Usuario.destroy({ where: { id: id } });

  if (retorno > 0) {
    res.redirect("/usuarios");
  } else {
    res.send("Erro ao excluir usuário");
  }
});

// Jogo
const Jogos = require("./models/Jogos");
const { where } = require("sequelize");

app.get("/jogo", async (req, res) => {
  const jogo = await Jogos.findAll({ raw: true });
  res.render("jogo", { jogo });
});

app.get("/jogo/novo", (req, res) => {
  res.render("formJogo");
});

app.post("/jogo/novo", async (req, res) => {
  const dadosJogos = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precoBase: req.body.precoBase,
  };

  const jogo = await Jogos.create(dadosJogos);
  res.send("Jogo Inserido:" + jogo.id);
});

app.get("/jogo/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogos.findByPk(id, { raw: true });
  res.render("formJogo", { jogo });
});

// Atualizar
app.post("/jogo/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const dadosJogos = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precoBase: req.body.precoBase,
  };

  const retorno = await Jogos.update(dadosJogos, {
    where: { id: id },
  });

  if (retorno > 0) {
    res.redirect("/jogo");
  } else {
    res.send("Erro ao atualizar jogo");
  }
});

// Delete
app.post("/jogo/:id/delete", async (req, res) => {
  const id = parseInt(req.params.id);
  const retorno = await Jogos.destroy({ where: { id: id } });

  if (retorno > 0) {
    res.redirect("/jogo");
  } else {
    res.send("Erro ao excluir jogo");
  }
});

// Rota Cartões
// Ver Cartões
app.get("/usuarios/:id:/cartoes", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("cartoes.handlebars", { usuario });
});

// Fomulário de cadastro de cartão
app.get("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });
})

// Porta que o servidor está rodando
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
