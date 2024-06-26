// Importações dos módulos
require("dotenv").config();
const db = require("./db/db");
const express = require("express");
const handlebars = require("express-handlebars");

const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");
const Jogo = require("./models/Jogo");
const Conquista = require("./models/Conquista");

Jogo.belongsToMany(Usuario, { through: "aquisicoes" });
Usuario.belongsToMany(Jogo, { through: "aquisicoes" });

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

// Atualizar
app.get("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });
  res.render("formUsuarios", { usuario });
});

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
const Jogos = require("./models/Jogo");
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
app.get("/usuarios/:id/cartoes", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  const cartoes = await Cartao.findAll({
    raw: true,
    where: { UsuarioId: id },
  });
  res.render("cartoes.handlebars", { usuario, cartoes });
});

// Fomulário de cadastro de cartão
app.get("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formCartao", { usuario });
});

// Cadastro de cartão
app.post("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosCartao = {
    numero: req.body.numero,
    nome: req.body.nome,
    codSeguranca: req.body.codSeguranca,
    UsuarioId: id,
  };

  await Cartao.create(dadosCartao);

  res.redirect(`/usuarios/${id}/cartoes`);
});

// Conquista
app.get("/jogo/:id/conquista", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  const conquista = await Conquista.findAll({
    raw: true,
    where: { JogoId: id },
  });
  res.render("conquista", { jogo, conquista });
});

app.get("/jogo/:id/conquista/novo", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });
  res.render("formConquista", { jogo });
});

app.post("/jogo/:id/conquista/novo", async (req, res) => {
  const id = parseInt(req.params.id);
  const dadosConquista = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    JogoId: id,
  };

  await Conquista.create(dadosConquista);
  res.redirect(`/jogo/${id}/conquista`);
});

// Atualizar
app.get("/jogo/:jogoId/conquista/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogoId = parseInt(req.params.jogoId)
  const conquista = await Conquista.findByPk(id, { raw: true });
  res.render("formConquista", { conquista, jogoId });
});

app.post("/jogo/:jogoId/conquista/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogoId = parseInt(req.params.jogoId)
  const dadosConquista = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
  };

  const retorno = await Conquista.update(dadosConquista, {
    where: { id: id },
  });

  if (retorno > 0) {
    res.redirect(`/jogo/${jogoId}/conquista`);
  } else {
    res.send("Erro ao atualizar conquista");
  }
});

// Delete
app.post("/jogo/conquista/:id/delete", async (req, res) => {
  const id = parseInt(req.params.id);
  const retorno = await Conquista.destroy({ where: { id: id } });

  if (retorno > 0) {
    res.redirect(`/jogo/${req.params.jogoId}/conquista`);
  } else {
    res.send("Erro ao excluir conquista");
  }
});

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
