require("dotenv").config({ path: "./.env.local" });
const mongoose = require("mongoose");

console.log("Connecting...");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ CONNECTED");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ ERROR");
    console.log(err);
    process.exit(1);
  });