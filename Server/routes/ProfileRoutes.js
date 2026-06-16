const express = require("express");
const router = express.Router();
module.exports = router;
const upload = require("../middleware/uploadMiddleware");

const User = require("../models/user");
const protect = require("../middleware/authMiddleware");

router.put("/update", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.bio = req.body.bio;
    user.github = req.body.github;
    user.linkedin = req.body.linkedin;
    user.skills = req.body.skills;
    user.targetRoles = req.body.targetRoles;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    console.log("USER FROM DB:", user);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  async (req, res) => {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    try {
      const user = await User.findById(req.user._id);

      user.resume = req.file.filename;
      console.log("BEFORE SAVE:", user.resume);

      await user.save();
      console.log("AFTER SAVE:", user.resume);

      res.json({
        message: "Resume uploaded successfully",
        resume: req.file.filename,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Public mentor profile (view by anyone)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Normalize response shape with GET /me and avoid frontend parsing issues
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/mentor-update", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.mentorBio = req.body.bio;
    user.mentorGithub = req.body.github;
    user.mentorLinkedin = req.body.linkedin;

    user.currentCompany = req.body.currentCompany;
    user.currentRole = req.body.currentRole;
    user.previousCompany = req.body.previousCompany;
    user.experience = req.body.experience;
    user.location = req.body.location;
    user.openToReferral = req.body.openToReferral;

    await user.save();

    res.json({
      message: "Mentor profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;