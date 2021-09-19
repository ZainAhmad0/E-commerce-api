import express from "express";

// middlewares
import {auth} from "../../middlewares/auth/index.js"

//router
const Router = express.Router();

// @route             POST api/product/
// @description       create a product
// @access            private

Router.post("/",[auth], async (req, res) => {

})

// @route             GET api/category/:id/products
// @description       get particular category products
// @access            private

Router.get("/", async (req, res) => {
    
})

// @route             GET api/category/:id/products/:id
// @description       get particular product
// @access            public

Router.get("/", async (req, res) => {
    
})

// @route             PATCH api/category/:id/products/:id
// @description       update a product 
// @access            private

Router.patch("/",[auth],  async (req, res) => {
    
})

// @route             DELETE api/category/:id/products/:id
// @description       delete a product 
// @access            private

Router.patch("/", [auth], async (req, res) => {
    
})

export default Router;
