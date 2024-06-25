const db = require("../db/db");
const { DataTypes } = require("sequelize");
const Jogo = require("./Jogo");

const Conquista = db.define("Conquista", {
  titulo: {
    type: DataTypes.STRING,
    require: true,
  },
  descricao: {
    type: DataTypes.STRING,
    require: true,
  },
});

Conquista.belongsTo(Jogo);
Jogo.hasMany(Conquista);

module.exports = Conquista;
