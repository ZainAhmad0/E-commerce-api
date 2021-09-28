import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../DB Connection/index.js";

async function generatePasswordHash(password) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

async function getJSONWebToken(payload) {
  const jwtSecret = process.env.jwtSecret;
  const expiryTime = 46000;
  try {
    const token = await jwt.sign(payload, jwtSecret, { expiresIn: expiryTime });
    return token;
  } catch (err) {
    res.status(err.status.error_code).send(err.status.error_message);
  }
}

async function validateUserCredentials(req) {
  const { email, password } = req.body;
  let user = await pool.query(
    `select *from inventory.public.user_info ui where email = '${email}';`
  );
  if (user.rowCount === 0) {
    return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
  }
  const passwordhash = user.rows[0].passwordhash;
  const isMatch = await bcrypt.compare(password, passwordhash);
  if (isMatch) {
    // binding user id and role id in request body
    req.body = {
      userID: user.rows[0].id,
      roleId: user.rows[0].roleid,
      ...req.body,
    };
  }
  return isMatch;
}

export { validateUserCredentials, getJSONWebToken, generatePasswordHash };
