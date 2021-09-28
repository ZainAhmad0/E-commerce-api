import express from "express";

// http status codes
import { StatusCodes } from "http-status-codes";

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
    return res.status(StatusCodes.UNAUTHORIZED).send("Permissions denied");
  }
  await handleErrors(addCategory, req.body);
  await res.status(StatusCodes.CREATED).send("Category Added Successfully.");
});

// @route             Get api/category/
// @description       get product categories
// @access            public

Router.get("/", async (req, res) => {
  const catagories = await getCategories();
  res.status(StatusCodes.OK).json(catagories);
});

// @route             PATCH api/category/:category_name
// @description       update a product category
// @access            private

Router.put("/update/:category_name", [auth], async (req, res) => {
  const { category_name } = req.params;
  const categoryExists = await handleErrors(isCategoryExists, category_name);
  if (!categoryExists) {
    res.status(StatusCodes.NOT_FOUND).send({ msg: "Invalid product category" });
  }
  const category = await handleErrors(getProductCategory, category_name);
  const updatedCategory = req.body;
  category.category_name =
    updatedCategory.category_name || category.category_name;
  category.description = updatedCategory.description || category.description;
  category.active = updatedCategory.active || category.active;
  await handleErrors(updateCategory, { category_name, category });
  await res.status(StatusCodes.OK).send("Category updated Successfully.");
});

// @route             DELETE api/category/:category_name
// @description       active/deactive a product category
// @access            private

Router.patch("/updateActiveStatus/:category_name", [auth], async (req, res) => {
  const { category_name } = req.params;
  const { active } = req.body;
  const flag = await handleErrors(isCategoryExists, category_name);
  if (!flag) {
    res.status(StatusCodes.NOT_FOUND).send({ msg: "Invalid product category" });
  }
  await handleErrors(updateActiveStatusOfCategory, { category_name, active });
  await res.status(StatusCodes.CREATED).send("Cateogry Status Updated Successfully.");
});

export default Router;
