import Joi from "joi";

// http status codes
import { StatusCodes } from "http-status-codes";

//utils
import { handleErrors, isCategoryExists } from "../../../../utils/index.js";

export default async (req, res, next) => {
  const { body } = req;
  const categoryValidatorSchema = Joi.object({
    category_name: Joi.string().max(75).required(),
    description: Joi.string().required(),
    active: Joi.boolean().required(),
  });

  try {
    await categoryValidatorSchema.validateAsync(body);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: err.details[0].message,
    });
  }

  // checking that product category exists or not
  const { category_name } = body;
  const flag = await handleErrors(isCategoryExists, category_name);
  if (flag) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: "Category Already Exists",
    });
  } else {
    next();
  }
};
