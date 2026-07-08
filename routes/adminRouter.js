const express = require("express");
const router = express.Router();

const renderHomePage = require("../utils/renderHomePage");
const loginAdminUser = require("../controllers/loginAdminUser");
const Complaint = require("../models/Complaint");

const authMiddleareAdmin = require("../middleware/authAdmin");

router.get("/login", (req, res) => {
  res.render("adminLogin");
});

router.post("/login", async (req, res) => {
  try {
    const token = await loginAdminUser(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.redirect("/admin/home");
  } catch (err) {
    console.error("Error while admin login:", err);

    return res.render("adminLogin", {
      message: "Invalid username or password",
    });
  }
});

// =====================
// Admin Dashboard
// =====================
router.get("/home", authMiddleareAdmin, async (req, res) => {
  try {
    const filter = {
      hostel_no: req.user.hostel_no,
    };

    const data = await renderHomePage(req, res, {}, filter);

    return res.render("adminHome", data);
  } catch (err) {
    console.error("Error loading admin dashboard:", err);
    return res.redirect("/admin/login");
  }
});

// =====================
// Resolve Complaint
// =====================
router.post("/resolve/:id", authMiddleareAdmin, async (req, res) => {
  try {
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.redirect("/admin/home");
    }

    complaint.status = "resolved";
    complaint.resolvedAt = new Date(); // optional but recommended

    await complaint.save();

    const filter = {
      hostel_no: req.user.hostel_no,
    };

    const data = await renderHomePage(
      req,
      res,
      {
        message: "Complaint resolved successfully.",
      },
      filter
    );

    return res.render("adminHome", data);
  } catch (err) {
    console.error("Error while resolving complaint:", err);
    return res.redirect("/admin/home");
  }
});

module.exports = router;