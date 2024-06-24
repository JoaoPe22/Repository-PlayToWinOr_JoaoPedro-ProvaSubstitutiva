const db = require("../db/db");
const { DataTypes } = require("sequelize");

const Jogo = db.define("Jogo", {
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

module.exports = Jogo;
