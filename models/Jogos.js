const db = require("../db/db");
const { DataTypes } = require("sequelize");

const Jogos = db.define("Jogo", {
  titulo: {
    type: DataTypes.STRING,
    required: true,
  },
  descricao: {
    type: DataTypes.STRING,
    required: true,
  },
  precoBase: {
    type: DataTypes.DOUBLE,
  },
});

module.exports = Jogos;
