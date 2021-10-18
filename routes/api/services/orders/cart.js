// db
import pool from "../../../../DB Connection/index.js";

// utils
import { handleErrors, getUserRole } from "../../../../utils/index.js";

// uuid
import { v4 } from "uuid";

// function to validate user role to adding items into cart
async function validateUserRoleForUsingCart(roleId) {
  const title = await handleErrors(getUserRole, roleId);
  return title === "Buyer";
}

// function for creating user session for shopping
async function createUserShoppingSession(userID) {
  if (await isShoppingSessionExists(userID)) {
    return;
  } else {
    const query = `insert into inventory.public.shopping_session (id,user_id) values ('${v4()}','${userID}');`;
    await pool.query(query);
  }
}

// function for chechking user session for shopping
async function isShoppingSessionExists(userID) {
  const query = `select * from inventory.public.shopping_session ss where user_id='${userID}';`;
  const result = await pool.query(query);
  return result.rowCount === 0 ? false : true;
}

// function for getting user shopping session id
async function getUserShoppingSession(userID) {
  const query = `select * from inventory.public.shopping_session ss where user_id='${userID}';`;
  const result = await pool.query(query);
  return result.rows.length === 0 ? null : result.rows[0].id;
}

// function for adding item into cart
async function addItemToCart({ productId, quantity, userID, sellerId }) {
  const session_id = await getUserShoppingSession(userID);
  const item = await getItemFromCart(productId, session_id);
  let query = "";
  if (item !== undefined) {
    query = `
    UPDATE cart_item SET quantity =${quantity}+${item.quantity} WHERE product_id = '${productId}' and seller_id='${sellerId}';
    `;
  } else {
    query = `insert into inventory.public.cart_item (id,session_id,product_id,seller_id,quantity) values ('${v4()}','${session_id}','${productId}','${sellerId}',${quantity});`;
  }
  await pool.query(query);
}

// function for getting item from cart
async function getItemFromCart(productId, session_id) {
  const query = `select * from inventory.public.cart_item where product_id='${productId}' and session_id = '${session_id}';`;
  const result = await pool.query(query);
  return result.rows === null ? null : result.rows[0];
}

// function for getting all items from cart
async function getItemsFromCart(userID) {
  const session_id = await getUserShoppingSession(userID);
  const query = `select product_id, quantity,seller_id from inventory.public.cart_item where session_id='${session_id}';`;
  const result = await pool.query(query);
  return result.rows === null ? null : result.rows;
}

// function for clearing cart
async function clearCart(userID) {
  const session_id = await getUserShoppingSession(userID);
  if (session_id != null) {
    const query = `delete from inventory.public.cart_item where session_id='${session_id}';`;
    await pool.query(query);
  }
}

// function for deleting a single item from cart
async function deleteItemFromCart({ userID, product_id }) {
  const session_id = await getUserShoppingSession(userID);
  if (session_id != null) {
    const query = `delete from inventory.public.cart_item where product_id='${product_id}';`;
    await pool.query(query);
  }
}

// function for clearing shopping session
async function clearShoppingSession(userID) {
  const query = `delete from inventory.public.shopping_session where user_id='${userID}';`;
  await pool.query(query);
}

export {
  validateUserRoleForUsingCart,
  createUserShoppingSession,
  isShoppingSessionExists,
  getUserShoppingSession,
  addItemToCart,
  getItemFromCart,
  getItemsFromCart,
  clearCart,
  clearShoppingSession,
  deleteItemFromCart,
};
