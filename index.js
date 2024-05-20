const { Client } = require("pg");
require("dotenv").config();

const express = require("express");
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/usuarios/novo")
});

app.get("/usuarios/novo", (req, res) => {
    res.sendFile(`${__dirname}/views/new-user.html`);
});

app.post("/usuarios/novo", (req, res) => {
    const nickname = req.body.nickname
    const nome = req.body.nome

    client.query(
        `INSERT INTO usuarios (usuario_nickname, usuario_nome) values ('${nickname}', '${nome}') returning *`,
        (err, result) => {
            if(err){
                res.send("Erro: " + err);
            }else{
                res.send("Sucesso: " +  JSON.stringify(result.rows));
            }
        }
    )
});
app.listen(3000);



const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

client
  .connect()
  .then(() => {
    console.log("Conectando com SUCESSO!!!");
    // exibeUsuariosCadastrados();
  })
  .catch((err) => {
    console.error("Houve um erro: " + `Erro: ${err}`);
  });

// function exibeUsuariosCadastrados() {
//   client.query("select * from usuarios", (err, result) => {
//     if (err) {
//       console.error("Erro ao executar a busca: " + err);
//     } else {
//       console.log("Resultado: " + JSON.stringify(result.rows));
//     }
//     fechaConexao();
//   });
// }

// function fechaConexao() {
//   client
//     .end()
//     .then(() => {
//       console.log("Conexão encerrada!");
//     })
//     .catch((err) => {
//       console.error("Erro ao encerrar conexão:", err);
//     });
// }
