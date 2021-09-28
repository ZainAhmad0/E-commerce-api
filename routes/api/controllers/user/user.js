import express from "express";
import { check, validationResult } from "express-validator";

// http status codes
import { StatusCodes } from "http-status-codes";

//router
const Router = express.Router();

// services
import { addUserToDB } from "../../services/user/index.js";

// utils
import {
  getJSONWebToken,
  validateUserCredentials,
  handleErrors,
} from "../../../../utils/index.js";

// middlewares
import { validator as userValidator } from "../../middlewares/user/index.js";

// @route             POST api/user/signup
// @description       user signup Route
// @access            Public

Router.post("/signup", [userValidator], async (req, res) => {
  await addUserToDB(req.body);
  await returnToken(req, res);
});

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
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    // validate user credentials
    const isUserValid = await handleErrors(validateUserCredentials, req);
    if (!isUserValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    await returnToken(req, res);
  }
);

async function returnToken(req, res) {
  const payload = {
    userID: req.body.userID,
    roleId: req.body.roleId,
  };
  const token = await getJSONWebToken(payload);
  return res.json({ token });
}

export default Router;
