const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminUser");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const loginAdminUser = async (data) => {
  const username = data.username;
  const password = data.password;

  const adminUser = await AdminUser.findOne({ username });

  if (!adminUser) {
    throw new Error("User does not exist");
  }

  // Keep plain-text comparison ONLY if admin passwords are stored as plain text
  const valid = password === adminUser.password;

  if (!valid) {
    throw new Error("Username or password is incorrect");
  }

  const token = jwt.sign(
    {
      id: adminUser._id,
      username: adminUser.username,
      hostel_no: adminUser.hostel_no,
      type: adminUser.type,
    },
    SECRET,
    {
      expiresIn: EXPIRES_IN,
    }
  );

  return token;
};

module.exports = loginAdminUser;