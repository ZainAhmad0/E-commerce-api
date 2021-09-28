import Joi from "joi";
//utils
import { handleErrors, isProductExistsById } from "../../../../utils/index.js";

export default async (req, res, next) => {
  const { body } = req;
  const cartValidatorSchema = Joi.object({
    productId: Joi.string().max(100).required(),
    quantity: Joi.number().required(),
  });

  try {
    await cartValidatorSchema.validateAsync(body);
  } catch (err) {
    return res.status(400).send({
      error: err.details[0].message,
    });
  }

  // checking that product exists or not
  const { productId } = body;
  const isProductExists = await handleErrors(isProductExistsById, productId);
  if (!isProductExists) {
    return res.status(400).send({
      error: "Product doesnot exists",
    });
  } else {
    next();
  }
};
