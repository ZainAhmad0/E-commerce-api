import Joi from "joi";
//utils
import {
  handleErrors,
  isProductExists,
  getCategoryStatus,
} from "../../../../utils/index.js";

export default async (req, res, next) => {
  const { body } = req;
  const categoryValidatorSchema = Joi.object({
    category_id: Joi.number().required(),
    title: Joi.string().max(100).required(),
    picture: Joi.string().max(60).required(),
    price: Joi.number().required(),
    summary: Joi.string().required(),
    active: Joi.boolean().required(),
  });

  try {
    await categoryValidatorSchema.validateAsync(body);
  } catch (err) {
    return res.status(400).send({
      error: err.details[0].message,
    });
  }

  // checking that product already exists or not
  const { title, category_id } = body;
  const flag = await handleErrors(isProductExists, title);
  const active = await handleErrors(getCategoryStatus, category_id); // if product category is active or not
  console.log(active);
  if (flag) {
    return res.status(400).send({
      error: "Product Already Exists",
    });
  } else if (!active) {
    return res.status(400).send({
      error: "Product category is not active",
    });
  } else {
    next();
  }
};
