import pg from "pg";
const { Pool } = pg;
export default new Pool({
  host: process.env.db_host,
  port: process.env.db_port,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.database,
});
