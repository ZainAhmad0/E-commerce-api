import { handleErrors, getUserRole } from "../../../../utils/index.js";

import pool from "../../../../DB Connection/index.js";

// function to validate user role to add items in inventory
async function validateUserRoleForManipulatingItem(roleId) {
  const title = await handleErrors(getUserRole, roleId);
  return title === "Seller" || "Buyer";
}

// function to update item to database
async function updateItem(req) {
  const { productId } = req.body;
  seller_id = req.user.userID;
  const productInfo = await handleErrors(getItem, { productId, seller_id });
  let query = "";
  if (productInfo.rowCount !== 0) {
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

// function to buy item
async function buyItem({ productId, quantity, seller_id }) {
  const productInfo = await handleErrors(getItem, { productId, seller_id });
  const { sold, available } = productInfo.rows[0];
  const query = `
    UPDATE item SET available =${available}-${quantity},sold=${sold}+${quantity}, updatedat =current_timestamp WHERE productid = '${productId}' and seller_id='${seller_id}';
    `;
  await pool.query(query);
}

// function to check item availablility
async function checkAvailabality({ productId, quantity, seller_id }) {
  const productInfo = await handleErrors(getItem, { productId, seller_id });
  console.log(productInfo.rows[0])
  const { available } = productInfo.rows[0];
  return available >= quantity;
}

// function to get item from database
async function getItem({ productId, seller_id }) {
  const query = `select * from inventory.public.item i where productId='${productId}' and seller_id='${seller_id}';`;
  const result = await pool.query(query);
  return result;
}

// function to get item from database
async function getInventoryItems(userID) {
  const query = `select * from inventory.public.item i where seller_id='${userID}';`;
  const result = await pool.query(query);
  return result.rows;
}

// function to check whether the particular seller is selling the given product or not
async function verifySellerAgainstProduct({ productId, sellerId }) {
  const query = `select * from inventory.public.item i where seller_id='${sellerId}' and productid='${productId}';`;
  console.log(query);
  const result = await pool.query(query);
  return result.rows;
}

export {
  validateUserRoleForManipulatingItem,
  updateItem,
  checkAvailabality,
  buyItem,
  getInventoryItems,
  verifySellerAgainstProduct,
};
