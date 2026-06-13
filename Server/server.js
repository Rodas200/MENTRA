
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const adviceRoutes = require("./routes/adviceRoutes");
const profileRoutes = require("./routes/profileRoutes");
const referralRoutes = require("./routes/referralRoutes");

const app = express();


// Start server only after a successful DB connection
connectDB().then(() => {
  app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/advice", adviceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/referrals", referralRoutes);

app.get("/", (req, res) => {
  res.send("Mentra backend is running");
});

const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
