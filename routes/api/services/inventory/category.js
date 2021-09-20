// utils
import { getUserRole } from "../../../../utils/dbUtils.js";

// db
import pool from "../../../../DB Connection/index.js";

import {handleErrors} from "../../../../utils/index.js"

// function to add cateogry to database
async function addCategory({ category_name, description, active }) {
  const database = process.env.database;
  const query = `insert into ${database}.public.category (category_name,description,active) values ('${category_name}','${description}',${active})`;
  await pool.query(query);
}

// function to validate user role to add category
async function validateUserRoleForAddingCategory(roleId) {
  const title = await handleErrors(getUserRole,roleId);
  return title === "Seller" ? true : false;
}

export { validateUserRoleForAddingCategory, addCategory };
