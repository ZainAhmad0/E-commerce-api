const express = require('express');
const Router = express.Router();

// middlewares
const userValidator = require('../../middlewares/user/validator')
const addUserToDB = require("../../middlewares/user/addUserToDB")

// @route             POST api/user/signup
// @description       user signup Route
// @access            Public

Router.post("/signup", [userValidator,addUserToDB])

module.exports = Router;