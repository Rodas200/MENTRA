const express = require("express");
const router = express.Router();

const Request  = require("../models/ReferralRoutes.js");
const protect = require("../middleware/authMiddleware");

router.post("/send", protect, async (req, res) => {
  try {
    const request = await Request.create({
  fresher: req.user._id,
  mentor: req.body.mentorId,
  desiredRole: req.body.role,
  message: req.body.message,
  status: "pending",
});
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;