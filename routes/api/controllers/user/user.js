const express = require("express");
const Router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

// for functional composition
const ramda = require("ramda");

// db
const pool = require("../../../../DB Connection/db");

// middlewares

const userValidator = require("../../middlewares/user/validator");
const addUserToDB = require("../../middlewares/user/addUserToDB");
const getJSONWebToken = require("../../middlewares/user/getJSONWebToken");

// @route             POST api/user/signup
// @description       user signup Route
// @access            Public

//functional composition
// const composedUserMiddlewares = ramda.pipe(userValidator,addUserToDB,getJSONWebToken)

Router.post("/signup", [userValidator, addUserToDB, getJSONWebToken]);

// @route             POST api/user/login
// @description       user login Route
// @access            Public
Router.post(
  "/login",
  [
    check("email", "Please include a valid Email").isEmail(),
    check("password", "Please enter a password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      let user = await pool.query(
        `select *from inventory.public.user_info ui where email = '${email}';`
      );
      if (user.rowCount === 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const passwordhash = user.rows[0].passwordhash;

      const isMatch = await bcrypt.compare(password, passwordhash);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // binding user id and role id in request body
      req.body.userID = user.rows[0].id;
      req.body.roleId = user.rows[0].roleId;
      getJSONWebToken(req,res);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = Router;
