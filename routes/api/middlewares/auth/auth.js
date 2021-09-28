import jwt from "jsonwebtoken";

// http status codes
import { StatusCodes } from "http-status-codes";

export default (req, res, next) => {
  // get token from header
  const token = req.header("x-auth-token");
  // check if token exists
  if (!token) {
    return res
      .send(StatusCodes.UNAUTHORIZED)
      .json({ msg: "No Token, Authorization denied" });
  }
  try {
    const jwtSecret = process.env.jwtSecret;
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { userID: decoded.userID, roleId: decoded.roleId };
    next();
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Token" });
  }
};
