const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

function authMiddleareAdmin(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/admin/login");
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    // Ensure only admins can access admin routes
    if (decoded.type !== "admin") {
      return res.redirect("/admin/login");
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Admin token verification failed:", err);
    return res.redirect("/admin/login");
  }
}

module.exports = authMiddleareAdmin;