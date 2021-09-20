import express from "express";

// middlewares
import { auth } from "../../middlewares/auth/index.js";

import { categoryValidator } from "../../middlewares/inventory/index.js";

// inventory services
import {
  validateUserRoleForAddingCategory,
  addCategory,
  getCategories,
  updateActiveStatusOfCategory,
  updateCategory,
} from "../../services/inventory/index.js";

// utils
import {
  handleErrors,
  isCategoryExists,
  getProductCategory,
} from "../../../../utils/index.js";
//router
const Router = express.Router();

// @route             POST api/category/
// @description       create a product category
// @access            private

Router.post("/", [auth, categoryValidator], async (req, res) => {
  const { roleId } = req.user;
  const isValid = await handleErrors(validateUserRoleForAddingCategory, roleId);
  if (!isValid) {
    return res.status(401).send("Permissions denied");
  }
  await handleErrors(addCategory, req.body);
  await res.status(201).send("Category Added Successfully.");
});

// @route             Get api/category/
// @description       get product categories
// @access            public

Router.get("/", async (req, res) => {
  const catagories = await getCategories();
  res.status(200).json(catagories);
});

// @route             PATCH api/category/:category_name
// @description       update a product category
// @access            private

Router.put("/update/:category_name", [auth], async (req, res) => {
  const { category_name } = req.params;
  const flag = await handleErrors(isCategoryExists, category_name);
  if (!flag) {
    res.status(404).send({ msg: "Invalid product category" });
  }
  const category = await handleErrors(getProductCategory, category_name);
  const updatedCategory = req.body;
  if (updatedCategory.category_name !== null) {
    category.category_name = updatedCategory.category_name;
  }
  if (updatedCategory.description !== null) {
    category.description = updatedCategory.description;
  }
  if (updatedCategory.active !== null) {
    category.active = updatedCategory.active;
  }
  await handleErrors(updateCategory, { category_name, category });
  await res.status(200).send("Category updated Successfully.");
});

// @route             DELETE api/category/:category_name
// @description       active/deactive a product category
// @access            private

Router.patch("/updateActiveStatus/:category_name", [auth], async (req, res) => {
  const { category_name } = req.params;
  const { active } = req.body;
  const flag = await handleErrors(isCategoryExists, category_name);
  if (!flag) {
    res.status(404).send({ msg: "Invalid product category" });
  }
  await handleErrors(updateActiveStatusOfCategory, { category_name, active });
  await res.status(201).send("Status Updated Successfully.");
});

export default Router;
