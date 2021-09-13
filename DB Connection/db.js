const { Client } = require("pg");
const client = new Client({
  host: process.env.db_host,
  port: process.env.db_port,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.database,
});

client.on("connect", () => {
  console.log("Connection Secured");
});

client.on("end", () => {
  console.log("Connection end");
});

module.exports = client;
