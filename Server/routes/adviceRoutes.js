const express = require("express");
const Advice = require("../models/Advice");
const Request = require("../models/Request");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { requestId, title, details } = req.body;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const advice = await Advice.create({
      fresher: request.fresher,
      mentor: request.mentor,
      request: request._id,
      title,
      details,
    });

    res.status(201).json({
      message: "Advice added successfully",
      advice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/my-advice", protect, async (req, res) => {
  try {
    const adviceList = await Advice.find({ fresher: req.user._id })
      .populate("mentor", "name email role")
      .populate("request", "desiredRole status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Advice fetched successfully",
      adviceList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;