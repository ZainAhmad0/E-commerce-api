const express = require('express');
const Router = express.Router();

const userValidator = require('../../middlewares/user/validator')

// @route             POST api/user/signup
// @description       user signup Route
// @access            Public

Router.post("/signup", userValidator)

module.exports = Router;