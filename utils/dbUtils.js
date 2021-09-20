import pool from "../DB Connection/index.js";

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
  const query = `select title from ${database}.public.role_table rt where id = ${id};`;
  const result = await pool.query(query);
  const title = result.rows[0].title;
  return title;
}

async function getProductCategory(category_name) {
  const database = process.env.database;
  const query = `select *from ${database}.public.category c where category_name = '${category_name}';`;
  const result = await pool.query(query);
  const category = result.rows[0];
  return category;
}

async function getProductByTitle(title) {
  const database = process.env.database;
  const query = `select *from ${database}.public.product p where title = '${title}';`;
  const result = await pool.query(query);
  const product = result.rows[0];
  return product;
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
  const query = `select *from ${database}.public.category c where category_name = '${category_name}';`;
  const result = await pool.query(query);
  return result.rowCount > 0 ? true : false;
}

// function to check that whether product already exists or not.
async function isProductExists(title) {
  const database = process.env.database;
  const query = `select *from ${database}.public.product p where title = '${title}';`;
  const result = await pool.query(query);
  return result.rowCount > 0 ? true : false;
}

// function to get category status.
async function getCategoryStatus(category_id) {
  const database = process.env.database;
  const query = `select *from ${database}.public.category c where category_id = '${category_id}';`;
  const result = await pool.query(query);
  return result.rows[0].active;
}

export {
  findRoleId,
  isUserExists,
  isCategoryExists,
  getUserRole,
  getProductCategory,
  isProductExists,
  getCategoryStatus,
  getProductByTitle
};
