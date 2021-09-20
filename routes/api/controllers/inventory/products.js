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

//router
const Router = express.Router();

// @route             POST api/product/
// @description       create a product
// @access            private

Router.post("/", [auth, productValidator], async (req, res) => {
  const { roleId } = req.user;
  const isValid = await handleErrors(validateUserRoleForAddingProduct, roleId);
  if (!isValid) {
    return res.status(401).send("Permissions denied");
  }
  // assigning a product id to the product
  const product = { id: v4(), ...req.body };
  await handleErrors(addProduct, product);
  await res.status(201).send("Product Added Successfully.");
});

// @route             GET api/category/:category_id
// @description       get particular category products
// @access            public

Router.get("/category/:category_id", async (req, res) => {
  const { category_id } = req.params;
  const products = await handleErrors(getProductsByCategory, category_id);
  res.status(201).send(products);
});

// @route             PATCH api/products/update/:title
// @description       update a product
// @access            private

Router.put("/update/:title", [auth], async (req, res) => {
  const { title } = req.params;
  const flag = await handleErrors(isProductExists, title);
  if (!flag) {
    res.status(404).send({ msg: "Invalid product" });
  }
  const product = await handleErrors(getProductByTitle, title);
  const updatedProduct = req.body;
  if (updatedProduct.category_id !== null) {
    product.category_id = updatedProduct.category_id;
  }
  if (updatedProduct.title !== null) {
    product.title = updatedProduct.title;
  }
  if (updatedProduct.picture !== null) {
    product.picture = updatedProduct.picture;
  }
  if (updatedProduct.price !== null) {
    product.price = updatedProduct.price;
  }
  if (updatedProduct.summary !== null) {
    product.summary = updatedProduct.summary;
  }
  if (updatedProduct.active !== null) {
    product.active = updatedProduct.active;
  }
  console.log("fdas ", title);
  await handleErrors(updateProduct, { title, product });
  await res.status(200).send("Product updated Successfully.");
});

// @route             PATCH api/products/update/:title
// @description       update product status
// @access            private

Router.patch("/updateActiveStatus/:title", [auth], async (req, res) => {
  const { title } = req.params;
  const { active } = req.body;
  const flag = await handleErrors(isProductExists, title);
  if (!flag) {
    res.status(404).send({ msg: "Invalid product" });
  }
  await handleErrors(updateActiveStatusOfProduct, { title, active });
  await res.status(201).send("Product Status Updated Successfully.");
});

export default Router;
