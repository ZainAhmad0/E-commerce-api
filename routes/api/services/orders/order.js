// services
import { getItemsFromCart } from "./index.js";

// db
import pool from "../../../../DB Connection/index.js";

import { getProductById } from "../inventory/index.js";

// uuid
import { v4 } from "uuid";

// utils
import { handleErrors } from "../../../../utils/index.js";

// function for order checking out process
async function checkoutOrder(userID) {
  // calculating total price of cart items
  const totalPrice = await getTotalPrice(userID);
  // assigning id to order
  const id = v4();
  const orderDetailsQuery = `insert into inventory.public.order_details (id,user_id,total,created_at) values ('${id}','${userID}',${totalPrice},current_timestamp);`;
  await pool.query(orderDetailsQuery);
  const cartItems = await handleErrors(getItemsFromCart, userID);
  for (let i = 0; i < cartItems.length; i++) {
    const { product_id } = cartItems[i];
    const orderItemQuery = `insert into inventory.public.order_items (order_id,product_id,created_at) values ('${id}','${product_id}',current_timestamp);`;
    await pool.query(orderItemQuery);
  }
}

// function to get total price of cart items
async function getTotalPrice(userID) {
  const cartItems = await handleErrors(getItemsFromCart, userID);
  // https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
  const totalPrice = (
    await Promise.all(
      cartItems.map(async (item) => {
        const { price } = (
          await handleErrors(getProductById, item.product_id)
        )[0];
        return price;
      })
    )
  ).reduce(function (a, b) {
    return a + b;
  }, 0);
  return totalPrice;
}

export { checkoutOrder };
