const db = require("../db/db")
const {DataTypes} = require("sequelize");

const Usuario = db.define("Usuario", {
    nickname:{
        type: DataTypes.STRING,
        required: true
    },
    nome: {
        type: DataTypes.STRING,
        required: true,
    },
});

module.exports = Usuario;