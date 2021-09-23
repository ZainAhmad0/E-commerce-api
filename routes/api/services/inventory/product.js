// utils
import { getUserRole } from "../../../../utils/dbUtils.js";

//db
import pool from "../../../../DB Connection/index.js";

import { handleErrors } from "../../../../utils/index.js";

// function to validate user role to add category
async function validateUserRoleForAddingProduct(roleId) {
  const title = await handleErrors(getUserRole, roleId);
  return title === "Seller" ? true : false;
}

// function to get products of particular category
async function getProductsByCategory(category_id) {
  const database = process.env.database;
  const query = `select * from ${database}.public.product p where category_id=${category_id};`;
  const result = await pool.query(query);
  return result.rows;
}

// function to get product by id
async function getProductById(productId) {
  const database = process.env.database;
  const query = `select * from ${database}.public.product p where id='${productId}';`;
  console.log(query);
  const result = await pool.query(query);
  return result.rows;
}

// function to add product in database
async function addProduct(product) {
  const { id, category_id, title, picture, price, summary, active } = product;
  const database = process.env.database;
  const query = `insert into ${database}.public.product (id,category_id,title,picture,price,summary,active,createdat,updatedat) values ('${id}',${category_id},'${title}','${picture}',${price},'${summary}',${active},current_timestamp,current_timestamp);`;
  await pool.query(query);
}

// function to update product category
async function updateProduct({ title, product }) {
  const newTitle = product.title;
  const { category_id, picture, price, summary, active } = product;
  const database = process.env.database;
  const query = `update ${database}.public.product set category_id=${category_id},title='${newTitle}',picture='${picture}',price=${price},summary='${summary}',active=${active} WHERE title = '${title}';`;
  await pool.query(query);
}

// function to update a product acitve status from database
async function updateActiveStatusOfProduct({ title, active }) {
  const database = process.env.database;
  const query = `UPDATE ${database}.public.product 
  SET active = ${active}
  WHERE title = '${title}';`;
  await pool.query(query);
}

export {
  validateUserRoleForAddingProduct,
  addProduct,
  getProductsByCategory,
  updateProduct,
  updateActiveStatusOfProduct,
  getProductById
};
