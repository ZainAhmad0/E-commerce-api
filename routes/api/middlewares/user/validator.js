const Joi = require("joi");
const client = require("../../../../DB Connection/db");
const PasswordComplexity = require("joi-password-complexity");

module.exports = async (req,res,next) => {
  const userValidatorSchema = Joi.object({
    firstName: Joi.string().max(50).required(),
    middleName: Joi.string().max(50),
    lastName: Joi.string().max(50).required(),
    mobile: Joi.number().min(11).max(15).required(),
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
    permanent_address: Joi.ref("present_address"),
    city: Joi.string().required().max(50),
    province: Joi.ref("city"),
    country: Joi.ref("city"),
  });

  try {
    const value = await userValidatorSchema.validateAsync(body);
    console.log(value)
  } catch (err) {
      console.log(err)
  }
  next();
}
