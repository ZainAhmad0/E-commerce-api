import express from "express";
import axios from "axios";

// http status codes
import { StatusCodes } from "http-status-codes";

// middlewares
import { auth } from "../../middlewares/auth/index.js";

// inventory services
import {
  checkoutOrder,
  getItemsFromCart,
  clearCart,
  clearShoppingSession,
} from "../../services/orders/index.js";

import { checkAvailabality } from "../../services/inventory/index.js";

// utils
import { handleErrors } from "../../../../utils/index.js";

//router
const Router = express.Router();

// @route              POST api/order/checkout
// @description       Add product to cart
// @access            private

Router.post("/checkout", [auth], async (req, res) => {
  // checking that cart is empty or not
  const cartItems = await handleErrors(getItemsFromCart, req.user.userID);
  if (cartItems.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).send("Cart is empty");
  }
  // checking that whether items in cart are avaialble in stock or not
  const unavailableItems = await checkAvailabilityOfCartItems(cartItems);
  if (unavailableItems.length != 0) {
    return res.status(StatusCodes.NOT_FOUND).send(unavailableItems);
  }
  // updating inventory
  const token = req.headers["x-auth-token"];
  await updateInventory(token, cartItems);
  // checking out order
  await handleErrors(checkoutOrder, req.user.userID);
  // clearing user cart
  await handleErrors(clearCart, req.user.userID);
  // clearing user shopping session
  await handleErrors(clearShoppingSession, req.user.userID);
  await res.status(StatusCodes.OK).send("Order placed successfully");
});

async function checkAvailabilityOfCartItems(cartItems) {
  const unavailableItems = [];
  for (let i = 0; i < cartItems.length; i++) {
    const data = {
      productId: cartItems[i].product_id,
      seller_id: cartItems[i].seller_id,
      quantity: cartItems[i].quantity,
    };
    console.log(data);
    const isAvailable = await handleErrors(checkAvailabality, data);
    if (!isAvailable) {
      unavailableItems.push(data);
    }
  }
  return unavailableItems;
}

async function updateInventory(token, cartItems) {
  console.log(cartItems)
  let config = {
    headers: {
      "x-auth-token": token,
    },
  };
  const URL = `http://localhost:3000/api/item/buy`;
  for (let i = 0; i < cartItems.length; i++) {
    const data = {
      productId: cartItems[i].product_id,
      seller_id: cartItems[i].seller_id,
      quantity: cartItems[i].quantity,
    };
    try {
      await axios.patch(URL, data, config);
    } catch (error) {}
  }
}

export default Router;
