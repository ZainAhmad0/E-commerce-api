const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header("x-auth-token");
  // check if token exists
  if (!token) {
    return res.send(401).json({ msg: "No Token, Authorization denied" });
  }
  try {
    const jwtSecret = process.env.jwtSecret;
    const decoded = jwt.verify(token, jwtSecret);
    req.userID = decoded.userID;
    req.roleId = decoded.roleId;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Token" });
  }
};
