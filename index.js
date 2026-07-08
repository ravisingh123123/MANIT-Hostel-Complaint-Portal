require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./db/db");

const userRouter = require("./routes/userRouter");
const complainRouter = require("./routes/complainRouter");
const adminRouter = require("./routes/adminRouter");
const authMiddleware = require("./middleware/auth");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./public"));

app.use("/user", userRouter);
app.use("/complaint", authMiddleware, complainRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.redirect("/user");
});

// Express 5 fallback
app.use((req, res) => {
  res.redirect("/user");
});

const PORT = process.env.PORT || 1080;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Hostel Complaint Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server");
    console.error(err);
  }
})();