import Joi from "joi";
//utils
import { handleErrors, isProductExistsById } from "../../../../utils/index.js";

export default async (req, res, next) => {
  const { body } = req;
  const itemValidatorSchema = Joi.object({
    productId: Joi.string().max(100).required(),
    quantity: Joi.number().required()
  });

  try {
    await itemValidatorSchema.validateAsync(body);
  } catch (err) {
    return res.status(400).send({
      error: err.details[0].message,
    });
  }

  // checking that product category exists or not
  const { productId } = body;
  const flag = await handleErrors(isProductExistsById, productId);
  if (!flag) {
    return res.status(400).send({
      error: "Product doesnot exists",
    });
  } else {
    next();
  }
};
