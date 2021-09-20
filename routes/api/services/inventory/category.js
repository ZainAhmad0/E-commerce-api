// utils
import { getUserRole } from "../../../../utils/dbUtils.js";

// db
import pool from "../../../../DB Connection/index.js";

import { handleErrors } from "../../../../utils/index.js";

// function to add cateogry to database
async function addCategory({ category_name, description, active }) {
  const database = process.env.database;
  const query = `insert into ${database}.public.category (category_name,description,active) values ('${category_name}','${description}',${active})`;
  await pool.query(query);
}

// function to get cateogry from database
async function getCategories() {
  const database = process.env.database;
  const query = `select * from ${database}.public.category c where active=true ;`;
  const result = await pool.query(query);
  return result.rows;
}

// function to update product category
async function updateCategory({ category_name, category }) {
  const database = process.env.database;
  const query = `update ${database}.public.category set category_name='${category.category_name}',description='${category.description}',active=${category.active} WHERE category_name = '${category_name}';`;
  await pool.query(query);
}

// function to update a product cateogry acitve status from database
async function updateActiveStatusOfCategory({ category_name, active }) {
  const database = process.env.database;
  const query = `UPDATE ${database}.public.category 
  SET active = ${active}
  WHERE category_name = '${category_name}';`;
  await pool.query(query);
}

// function to validate user role to add category
async function validateUserRoleForAddingCategory(roleId) {
  const title = await handleErrors(getUserRole, roleId);
  return title === "Seller" ? true : false;
}

export {
  validateUserRoleForAddingCategory,
  addCategory,
  getCategories,
  updateActiveStatusOfCategory,
  updateCategory,
};
