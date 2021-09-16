import pool from "../DB Connection/index.js"

async function findRoleId(role) {
  const database = process.env.database;
  const result = await pool.query(
    `select id from ${database}.public.role_table rt where title = '${role}';`
  );
  const id = result.rows[0].id;
  return id;
}

// function to check that whether user already exists or not.
async function isUserExists(email) {
  const database = process.env.database;
  const result = await pool.query(
    `select *from ${database}.public.user_info ui where email = '${email}';`
  );
  return result.rowCount === 0 ? 0 : 1;
}

export {findRoleId,isUserExists};
