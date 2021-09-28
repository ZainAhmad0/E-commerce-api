// utils
import { getUserRole } from "../../../../utils/dbUtils.js";

// db
import pool from "../../../../DB Connection/index.js";

import { handleErrors } from "../../../../utils/index.js";

// function to add cateogry to database
async function addCategory({ category_name, description, active }) {
  const query = `insert into inventory.public.category (category_name,description,active) values ('${category_name}','${description}',${active})`;
  await pool.query(query);
}

// function to get cateogry from database
async function getCategories() {
  const query = `select * from inventory.public.category c where active=true ;`;
  const result = await pool.query(query);
  return result.rows;
}

// function to update product category
async function updateCategory({ category_name, category }) {
  const query = `update inventory.public.category set category_name='${category.category_name}',description='${category.description}',active=${category.active} WHERE category_name = '${category_name}';`;
  await pool.query(query);
}

// function to update a product cateogry acitve status from database
async function updateActiveStatusOfCategory({ category_name, active }) {
  const query = `UPDATE inventory.public.category 
  SET active = ${active}
  WHERE category_name = '${category_name}';`;
  await pool.query(query);
}

// function to validate user role to add category
async function validateUserRoleForAddingCategory(roleId) {
  const title = await handleErrors(getUserRole, roleId);
  return title === "Seller";
}

export {
  validateUserRoleForAddingCategory,
  addCategory,
  getCategories,
  updateActiveStatusOfCategory,
  updateCategory,
};
