import express from "express";

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
  await validatePermission(req, res);
  await handleErrors(updateItem, req);
  await res.status(201).send("Item updated Successfully.");
});

// @route             PATCH api/item/
// @description       update item
// @access            private

Router.patch("/buy", [auth, itemValidator], async (req, res) => {
  await validatePermission(req, res);
  const availablityCheck = await handleErrors(checkAvailabality, req)
  console.log(availablityCheck)
  if (!availablityCheck) {
    return res.status(404).send("Out of stock");
  }
  await handleErrors(buyItem, req);
  await res.status(201).send("Successfull");
});

// function for validating permissions for manipulating items
async function validatePermission(req, res) {
  const { roleId } = req.user;
  const isValid = await handleErrors(
    validateUserRoleForManipulatingItem,
    roleId
  );
  if (!isValid) {
    return res.status(401).send("Permissions denied");
  }
}

export default Router;
