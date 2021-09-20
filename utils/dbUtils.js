import pool from "../DB Connection/index.js"

async function findRoleId(role) {
  const database = process.env.database;
  const result = await pool.query(
    `select id from ${database}.public.role_table rt where title = '${role}';`
  );
  const id = result.rows[0].id;
  return id;
}

async function getUserRole(id) {
  const database = process.env.database;
  const query= `select title from ${database}.public.role_table rt where id = ${id};`
  const result = await pool.query(query);
  const title = result.rows[0].title;
  return title;
}

// function to check that whether user already exists or not.
async function isUserExists(email) {
  const database = process.env.database;
  const result = await pool.query(
    `select *from ${database}.public.user_info ui where email = '${email}';`
  );
  return result.rowCount === 0 ? 0 : 1;
}

// function to check that whether product category already exists or not.
async function isCategoryExists(category_name) {
  const database = process.env.database;
  const query=`select *from ${database}.public.category c where category_name = '${category_name}';`
  const result = await pool.query(query);
  return result.rowCount > 0 ? true : false;
}

export {findRoleId,isUserExists,isCategoryExists,getUserRole};
