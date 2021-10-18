import Joi from "joi";
//utils
import { handleErrors, isProductExistsById } from "../../../../utils/index.js";
// sevices
import { verifySellerAgainstProduct } from "../../services/inventory/index.js";

// http status codes
import { StatusCodes } from "http-status-codes";

export default async (req, res, next) => {
  const { body } = req;
  const cartValidatorSchema = Joi.object({
    productId: Joi.string().max(100).required(),
    sellerId: Joi.string().max(100).required(),
    quantity: Joi.number().required(),
  });

  try {
    await cartValidatorSchema.validateAsync(body);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: err.details[0].message,
    });
  }

  // checking that product exists or not
  const { productId, sellerId } = body;
  const isProductExists = await handleErrors(isProductExistsById, productId);
  const isSellerAndProductAlligned = await handleErrors(
    verifySellerAgainstProduct,
    { productId, sellerId }
  );
  if (!isProductExists) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: "Product doesnot exists",
    });
  } else if (isSellerAndProductAlligned.length !== 1) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: "Given Seller is not selling the particular product",
    });
  } else {
    next();
  }
};
