import express from "express";

// http status codes
import { StatusCodes } from "http-status-codes";

// middlewares
import { auth } from "../../middlewares/auth/index.js";

import { itemValidator } from "../../middlewares/inventory/index.js";

// inventory services
import {
  validateUserRoleForManipulatingItem,
  updateItem,
  checkAvailabality,
  buyItem,
} from "../../services/inventory/index.js";

// utils
import { handleErrors } from "../../../../utils/index.js";
//router
const Router = express.Router();

// @route             PATCH api/item/
// @description       update item
// @access            private

Router.patch("/update", [auth, itemValidator], async (req, res) => {
  const isValid = await validatePermission(req.user);
  if (!isValid) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Permissions denied");
  }
  await handleErrors(updateItem, req);
  await res.status(StatusCodes.OK).send("Item updated Successfully.");
});

// @route             PATCH api/item/buy
// @description       update item
// @access            private

Router.patch("/buy", [auth, itemValidator], async (req, res) => {
  const isValid = await validatePermission(req.user);
  if (!isValid) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Permissions denied");
  }
  const availablityCheck = await handleErrors(checkAvailabality, req.body);
  if (!availablityCheck) {
    return res.status(StatusCodes.NOT_FOUND).send("Out of stock");
  }
  await handleErrors(buyItem, req.body);
  await res.status(StatusCodes.OK).send("Successfull");
});

// function for validating permissions for manipulating items
async function validatePermission({ roleId }) {
  const isValid = await handleErrors(
    validateUserRoleForManipulatingItem,
    roleId
  );
  return isValid;
}

export default Router;
