import express from "express";

// middlewares
import { auth } from "../../middlewares/auth/index.js";

import { categoryValidator } from "../../middlewares/inventory/index.js";

// inventory services
import { validateUserRoleForAddingCategory,addCategory } from "../../services/inventory/index.js";

// utils
import {handleErrors} from "../../../../utils/index.js"
//router
const Router = express.Router();

// @route             POST api/category/
// @description       create a product category
// @access            private

Router.post("/", [auth, categoryValidator], async (req, res) => {
  const { roleId } = req.user;
  const isValid = await handleErrors(validateUserRoleForAddingCategory,roleId)
  if (!isValid) {
    return res.status(401).send("Permissions denied");
  }
  await handleErrors(addCategory,req.body)
  await res.status(201).send("Category Added Successfully.")
});

// @route             Get api/category/
// @description       get product categories
// @access            public

Router.get("/", async (req, res) => {});

// @route             PATCH api/category/:id
// @description       update a product category
// @access            private

Router.patch("/", [auth], async (req, res) => {});

// @route             DELETE api/category/:id
// @description       delete a product category
// @access            private

Router.patch("/", [auth], async (req, res) => {});

export default Router;
