import pool from "../DB Connection/index.js";

async function findRoleId(role) {
  const result = await pool.query(
    `select id from inventory.public.role_table rt where title = '${role}';`
  );
  const id = result.rows[0].id;
  return id;
}

async function getUserRole(id) {
  const query = `select title from inventory.public.role_table rt where id = ${id};`;
  const result = await pool.query(query);
  const title = result.rows[0].title;
  return title;
}

async function getProductCategory(category_name) {
  const query = `select *from inventory.public.category c where category_name = '${category_name}';`;
  const result = await pool.query(query);
  const category = result.rows[0];
  return category;
}

async function getProductByTitle(title) {
  const query = `select *from inventory.public.product p where title = '${title}';`;
  const result = await pool.query(query);
  const product = result.rows[0];
  return product;
}

// function to check that whether user already exists or not.
async function isUserExists(email) {
  const result = await pool.query(
    `select *from inventory.public.user_info ui where email = '${email}';`
  );
  return result.rowCount === 0 ? 0 : 1;
}

// function to check that whether product category already exists or not.
async function isCategoryExists(category_name) {
  const query = `select *from inventory.public.category c where category_name = '${category_name}';`;
  const result = await pool.query(query);
  return result.rowCount > 0;
}

// function to check that whether product already exists or not.
async function isProductExists(title) {
  const query = `select *from inventory.public.product p where title = '${title}';`;
  const result = await pool.query(query);
  return result.rowCount > 0;
}

// function to check that whether product already exists or not.
async function isProductExistsById(productId) {
  const query = `select *from inventory.public.product p where id = '${productId}';`;
  const result = await pool.query(query);
  return result.rowCount > 0;
}

// function to get category status.
async function getCategoryStatus(category_id) {
  const query = `select *from inventory.public.category c where category_id = '${category_id}';`;
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
  getProductByTitle,
  isProductExistsById,
};
