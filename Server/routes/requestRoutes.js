const express = require("express");
const Request = require("../models/Request");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { mentorId, desiredRole, message } = req.body;

    const mentor = await User.findById(mentorId);

    if (!mentor || mentor.role !== "professional") {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    const existingRequest = await Request.findOne({
      fresher: req.user._id,
      mentor: mentorId,
      desiredRole,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const newRequest = await Request.create({
      fresher: req.user._id,
      mentor: mentorId,
      desiredRole,
      message,
    });

    res.status(201).json({
      message: "Referral request sent successfully",
      request: newRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/mentor", protect, async (req, res) => {
  try {
    const requests = await Request.find({
      mentor: req.user._id,
    })
      .populate("fresher", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    request.status = status;
    const updatedRequest = await request.save();

    res.status(200).json({
      message: "Request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.log("PUT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/my-sent-requests", protect, async (req, res) => {
  try {
    const requests = await Request.find({
      fresher: req.user._id,
    })
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/dashboard", protect, async (req, res) => {
  try {
    const requests = await Request.find({
      fresher: req.user._id,
    }).sort({ createdAt: -1 });

    const pending = requests.filter(
      (r) => r.status === "pending"
    ).length;

    const referred = requests.filter(
      (r) => r.status === "Referred"
    ).length;

    const needsImprovement = requests.filter(
      (r) => r.status === "Needs Improvement"
    ).length;

    res.status(200).json({
      pending,
      referred,
      needsImprovement,
      recentRequests: requests.slice(0, 5),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.get("/mentor-dashboard", protect, async (req, res) => {
  try {
   const requests = await Request.find({
  mentor: req.user._id,
}).sort({ createdAt: -1 });

console.log("Mentor ID:", req.user._id);
console.log("Requests:", requests);

    const pending = requests.filter(
      (r) => r.status === "pending"
    ).length;

    const referred = requests.filter(
      (r) => r.status === "Referred"
    ).length;

    const needsImprovement = requests.filter(
      (r) => r.status === "Needs Improvement"
    ).length;

    res.status(200).json({
      pending,
      referred,
      needsImprovement,
      recentRequests: requests.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
