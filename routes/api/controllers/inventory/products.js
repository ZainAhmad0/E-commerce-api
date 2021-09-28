import express from "express";
import { v4 } from "uuid";

// middlewares
import { auth } from "../../middlewares/auth/index.js";
import { productValidator } from "../../middlewares/inventory/index.js";

//utils
import {
  handleErrors,
  isProductExists,
  getProductByTitle,
} from "../../../../utils/index.js";

// services
import {
  validateUserRoleForAddingProduct,
  addProduct,
  getProductsByCategory,
  updateProduct,
  updateActiveStatusOfProduct,
} from "../../services/inventory/index.js";

// http status codes
import { StatusCodes } from "http-status-codes";

//router
const Router = express.Router();

// @route             POST api/product/
// @description       create a product
// @access            private

Router.post("/", [auth, productValidator], async (req, res) => {
  const { roleId } = req.user;
  const isValid = await handleErrors(validateUserRoleForAddingProduct, roleId);
  if (!isValid) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Permissions denied");
  }
  // assigning a product id to the product
  const product = { id: v4(), ...req.body };
  await handleErrors(addProduct, product);
  await res.status(StatusCodes.CREATED).send("Product Added Successfully.");
});

// @route             GET api/category/:category_id
// @description       get particular category products
// @access            public

Router.get("/category/:category_id", async (req, res) => {
  const { category_id } = req.params;
  const products = await handleErrors(getProductsByCategory, category_id);
  res.status(StatusCodes.OK).send(products);
});

// @route             PATCH api/products/update/:title
// @description       update a product
// @access            private

Router.put("/update/:title", [auth], async (req, res) => {
  const { title } = req.params;
  const productExists = await handleErrors(isProductExists, title);
  if (!productExists) {
    res.status(StatusCodes.NOT_FOUND).send({ msg: "Invalid product" });
  }
  const product = await handleErrors(getProductByTitle, title);
  const updatedProduct = req.body;
  product.category_id = updatedProduct.category_id || product.category_id;
  product.title = updatedProduct.title || product.title;
  product.picture = updatedProduct.picture || product.picture;
  product.price = updatedProduct.price || product.price;
  product.summary = updatedProduct.summary || product.summary;
  product.active = updatedProduct.active || product.active;
  await handleErrors(updateProduct, { title, product });
  await res.status(StatusCodes.OK).send("Product updated Successfully.");
});

// @route             PATCH api/products/update/:title
// @description       update product status
// @access            private

Router.patch("/updateActiveStatus/:title", [auth], async (req, res) => {
  const { title } = req.params;
  const { active } = req.body;
  const isProductValid = await handleErrors(isProductExists, title);
  if (!isProductValid) {
    res.status(StatusCodes.NOT_FOUND).send({ msg: "Invalid product" });
  }
  await handleErrors(updateActiveStatusOfProduct, { title, active });
  await res.status(StatusCodes.OK).send("Product Status Updated Successfully.");
});

export default Router;
