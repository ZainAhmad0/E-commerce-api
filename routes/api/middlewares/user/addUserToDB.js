const pool = require("../../../../DB Connection/db");
const { v4 } = require("uuid");
const bcrypt = require("bcryptjs");

const getJSONWebToken = require("./getJSONWebToken")


module.exports = async (req, res, next) => {
  const { body } = req;
  const user = {
    user_info: {
      id: v4(),
      firstName: body.firstName,
      roleId: await findRoleId(body.role),
      middleName: body.middleName,
      lastName: body.lastName,
      mobile: body.mobile,
      email: body.email,
      passwordHash: await generatePasswordHash(body.password),
      registeredAt: null,
      lastLogin: null,
      profile: body.profile,
    },
    user_address: {
      id: v4(),
      userId: null,
      present_address: body.present_address,
      permanent_address: body.permanent_address,
      city: body.city,
      province: body.province,
      country: body.country,
      createdAt: null,
      updatedAt: null,
    },
  };
  // binding user id and role id in request body 
  req.body.userID=user.user_info.id;
  req.body.roleId=user.user_info.roleId;
  
  await addUserInfoToDB(user.user_info);
  await addUserAddressInfoToDB(user.user_address, user.user_info.id);
  next();
};

async function generatePasswordHash(password) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

async function findRoleId(role) {
  const database = process.env.database;
  const result = await pool.query(
    `select id from ${database}.public.role_table rt where title = '${role}';`
  );
  const id = result.rows[0].id;
  return id;
}

async function addUserInfoToDB(user_info) {
  const database = process.env.database;
  const query = `
  INSERT
INTO
${database}.PUBLIC.USER_INFO (ID,
FIRSTNAME,
ROLEID,
MIDDLENAME,
LASTNAME,
MOBILE,
EMAIL,
PASSWORDHASH,
REGISTEREDAT,
LASTLOGIN,
PROFILE)
VALUES ('${user_info.id}', '${user_info.firstName}',
  ${user_info.roleId},'${user_info.middleName}',
  '${user_info.lastName}','${user_info.mobile}',
  '${user_info.email}','${user_info.passwordHash}'
  ,current_timestamp,current_timestamp,
  '${user_info.profile}');
  `;
  await pool.query(query);
}

async function addUserAddressInfoToDB(user_address, userID) {
  const database = process.env.database;
  const query = `
  INSERT
INTO
${database}.public.address(ID,
  userId,
present_address,
permanent_address,
city,
province,
country,
createdAt,
updatedAt)
VALUES ('${user_address.id}', '${userID}',
  '${user_address.present_address}','${user_address.permanent_address}',
  '${user_address.city}','${user_address.province}',
  '${user_address.country}'
  ,current_timestamp,current_timestamp);
  `;
  await pool.query(query);
}
