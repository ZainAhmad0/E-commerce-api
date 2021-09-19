import express from "express";

// middlewares
import {auth} from "../../middlewares/auth/index.js"

//router
const Router = express.Router();

// @route             POST api/category/
// @description       create a product category
// @access            private

Router.post("/",[auth], async (req, res) => {

})

// @route             Get api/category/
// @description       get product categories
// @access            public

Router.get("/", async (req, res) => {
    
})

// @route             PATCH api/category/:id
// @description       update a product category
// @access            private

Router.patch("/",[auth],  async (req, res) => {
    
})

// @route             DELETE api/category/:id
// @description       delete a product category
// @access            private

Router.patch("/", [auth], async (req, res) => {
    
})

export default Router;
