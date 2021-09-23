import { handleErrors, getUserRole } from "../../../../utils/index.js";

import pool from "../../../../DB Connection/index.js";

// function to validate user role to add items in inventory
async function validateUserRoleForAddingItem(roleId) {
  const title = await handleErrors(getUserRole, roleId);
  return title === "Seller" ? true : false;
}

// function to update item to database
async function updateItem(req) {
  const { productId } = req.body;
  const database = process.env.database;
  const productInfo = await handleErrors(getItem, productId);
  let query = "";
  if (productInfo.rowCount!==0) {
    const { quantity, available } = productInfo.rows[0];
    query = `
    UPDATE item SET productid = '${productId}', seller_id = '${req.user.userID}', quantity = ${req.body.quantity}+${quantity}, available =${req.body.quantity}+${available},updatedat =current_timestamp WHERE productid = '${productId}';
    `;
  } else {
    query = `
    INSERT INTO item(productid, seller_id, quantity, available,updatedat,createdat)
VALUES ('${productId}','${req.user.userID}',${req.body.quantity},${req.body.quantity},current_timestamp,current_timestamp);
    `;
  }
  await pool.query(query);
}

// function to get item from database
async function getItem(productId) {
  const database = process.env.database;
  const query = `select * from ${database}.public.item i where productId='${productId}';`;
  const result = await pool.query(query);
  return result;
}

export { validateUserRoleForAddingItem, updateItem };
