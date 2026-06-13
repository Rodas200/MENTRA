const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/authMiddleware");
const Request = require("../models/Request");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "60d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }


});

router.put("/profile", protect, async (req, res) => {
  try {
    const {
      bio,
      skills,
      github,
      linkedin,
      resume,
      portfolio,
      targetRoles,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "fresher") {
      return res.status(403).json({
        message: "Only freshers can update this profile",
      });
    }

    user.bio = bio ?? user.bio;
    user.skills = skills ?? user.skills;
    user.github = github ?? user.github;
    user.linkedin = linkedin ?? user.linkedin;
    user.resume = resume ?? user.resume;
    user.portfolio = portfolio ?? user.portfolio;
    user.targetRoles = targetRoles ?? user.targetRoles;

    await user.save();

    res.status(200).json({
      message: "Fresher profile updated successfully",
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/mentor-profile", protect, async (req, res) => {
  try {
    const {
      mentorBio,
      mentorGithub,
      mentorLinkedin,
      currentCompany,
      currentRole,
      previousCompany,
      experience,
      location,
      openToReferral,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "professional") {
      return res.status(403).json({
        message: "Only professionals can update this profile",
      });
    }

    user.mentorBio = mentorBio ?? user.mentorBio;
    user.mentorGithub = mentorGithub ?? user.mentorGithub;
    user.mentorLinkedin = mentorLinkedin ?? user.mentorLinkedin;
    user.currentCompany = currentCompany ?? user.currentCompany;
    user.currentRole = currentRole ?? user.currentRole;
    user.previousCompany = previousCompany ?? user.previousCompany;
    user.experience = experience ?? user.experience;
    user.location = location ?? user.location;
    user.openToReferral = openToReferral ?? user.openToReferral;

    await user.save();

    res.status(200).json({
      message: "Mentor profile updated successfully",
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/dashboard", protect, async (req, res) => {
  try {
    const pending = await Request.countDocuments({
      fresher: req.user._id,
      status: "pending",
    });

    const referred = await Request.countDocuments({
      fresher: req.user._id,
      status: "referred",
    });

    const needsImprovement = await Request.countDocuments({
      fresher: req.user._id,
      status: "needs improvement",
    });

    const recentRequests = await Request.find({
      fresher: req.user._id,
    })
      .populate("mentor", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      pending,
      referred,
      needsImprovement,
      recentRequests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/mentors", protect, async (req, res) => {
  try {
    const mentors = await User.find({
      role: "professional",
    }).select("name email role currentCompany currentRole previousCompany");

    // Map fields to what the UI expects: company + role title.
    const mapped = mentors.map((m) => ({
      _id: m._id,
      name: m.name,
      avatar: m.photo || "",
      avatarColor: "#5b4fcf",
      openToReferral: m.openToReferral,
      tags: m.skills,
      mutualConnections: 0,
      company: m.currentCompany || m.previousCompany || "",
      role: m.currentRole || "",
    }));

    res.json(mapped);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
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

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;