import express from "express";

// http status codes
import { StatusCodes } from "http-status-codes";

// middlewares
import { auth } from "../../middlewares/auth/index.js";
import { cartValidator } from "../../middlewares/orders/index.js";

// inventory services
import {
  validateUserRoleForUsingCart,
  createUserShoppingSession,
  addItemToCart,
  getItemsFromCart,
  clearCart,
  clearShoppingSession,
  deleteItemFromCart,
} from "../../services/orders/index.js";

// utils
import { handleErrors } from "../../../../utils/index.js";

//router
const Router = express.Router();

// @route             POST api/cart/add
// @description       Add product to cart
// @access            private

Router.post("/add", [auth, cartValidator], async (req, res) => {
  // validating user role for adding items in cart
  const isValid = await validateUserRoleForManipulatingCart(req.user);
  if (!isValid) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Permissions denied");
  }
  // maintaining user shopping session
  await handleErrors(createUserShoppingSession, req.user.userID);
  // adding item into cart
  await handleErrors(addItemToCart, { ...req.user, ...req.body });
  await res.status(StatusCodes.OK).send("Product Added Successfully in cart.");
});

// @route             GET api/cart
// @description       Get items of cart
// @access            private

Router.get("/", [auth], async (req, res) => {
  const cartItems = await handleErrors(getItemsFromCart, req.user.userID);
  await res.status(StatusCodes.OK).send(cartItems);
});

// @route             DELETE api/cart
// @description       Clear cart items
// @access            private

Router.delete("/", [auth], async (req, res) => {
  // clearing cart
  await handleErrors(clearCart, req.user.userID);
  // deleting shopping session
  await handleErrors(clearShoppingSession, req.user.userID);
  await res.status(StatusCodes.OK).send("Cart Cleared");
});

// @route             PATCH api/cart/:id
// @description       Delete a particular item from cart
// @access            private

Router.patch("/:product_id", [auth], async (req, res) => {
  const { product_id } = req.params;
  // deleting a single item from cart
  await handleErrors(deleteItemFromCart, { product_id, ...req.user });
  // checking if cart is empty now then clearing shopping session
  const cartItems = await handleErrors(getItemsFromCart, req.user.userID);
  if (cartItems.length === 0) {
    await handleErrors(clearShoppingSession, req.user.userID);
  }
  await res.status(StatusCodes.OK).send("Item deleted from cart");
});

// function for validating user role for manipulating cart
async function validateUserRoleForManipulatingCart({ roleId }) {
  const isValid = await handleErrors(validateUserRoleForUsingCart, roleId);
  return isValid;
}

export default Router;
