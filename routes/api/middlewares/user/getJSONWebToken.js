const jwt = require("jsonwebtoken");
const pool = require("../../../../DB Connection/db");

module.exports = async (req, res) => {
  const payload = {
    userID: req.body.userID,
    roleId: req.body.roleId,
  };
  const jwtSecret = process.env.jwtSecret;
  const expiryTime = 46000;
  try {
    jwt.sign(payload, jwtSecret, { expiresIn: expiryTime }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(err.status.error_code).send(err.status.error_message);
  }
};
