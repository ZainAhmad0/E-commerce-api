import Joi from "joi";
import PasswordComplexity from "joi-password-complexity";
//utils
import { handleErrors, isUserExists } from "../../../../utils/index.js";

// http status codes
import { StatusCodes } from "http-status-codes";

export default async (req, res, next) => {
  const roles = {
    A: "Buyer",
    B: "Seller",
    C: "Customer",
  };
  const { body } = req;
  const userValidatorSchema = Joi.object({
    role: Joi.string().valid(...Object.values(roles)),
    firstName: Joi.string().max(50).required(),
    middleName: Joi.string().max(50),
    lastName: Joi.string().max(50).required(),
    mobile: Joi.string().min(11).max(15).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required()
      .max(50),
    password: new PasswordComplexity({
      min: 8,
      max: 50,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
    }),
    repeat_password: Joi.ref("password"),
    profile: Joi.string(),
    present_address: Joi.string().max(100).required(),
    permanent_address: Joi.string().max(100).required(),
    city: Joi.string().required().max(50),
    province: Joi.string().required().max(50),
    country: Joi.string().required().max(50),
  });

  try {
    await userValidatorSchema.validateAsync(body);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: err.details[0].message,
    });
  }

  // checking that user already exists or not
  const { email } = body;
  const isUserValid = await handleErrors(isUserExists, email);
  if (isUserValid) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: "User Already Exists",
    });
  } else {
    next();
  }
};
