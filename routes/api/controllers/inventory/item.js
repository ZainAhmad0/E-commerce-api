import express from "express";

// middlewares
import { auth } from "../../middlewares/auth/index.js";

import { itemValidator } from "../../middlewares/inventory/index.js";

// inventory services
import {
  validateUserRoleForAddingItem,
  updateItem,
} from "../../services/inventory/index.js";

// utils
import { handleErrors } from "../../../../utils/index.js";
//router
const Router = express.Router();

// @route             PATCH api/item/
// @description       update item
// @access            private

Router.patch("/update", [auth, itemValidator], async (req, res) => {
  const { roleId } = req.user;
  const isValid = await handleErrors(validateUserRoleForAddingItem, roleId);
  if (!isValid) {
    return res.status(401).send("Permissions denied");
  }
  await handleErrors(updateItem, req);
  await res.status(201).send("Item updated Successfully.");
});

export default Router;
