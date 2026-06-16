const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["fresher", "professional"],
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
        default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    targetRoles: {
      type: [String],
      default: [],
    },

    resume: {
      type: String,
      default: "",
    },

    // Used by fresher UI (Profile.jsx) and userRoutes PUT /profile
    portfolio: {
      type: String,
      default: "",
    },

    currentCompany: {
  type: String,
  default: "",
},

currentRole: {
  type: String,
  default: "",
},

previousCompany: {
  type: String,
  default: "",
},

experience: {
  type: Number,
  default: 0,
},

location: {
  type: String,
  default: "",
},

photo: {
  type: String,
  default: "",
},
mentorBio: {
  type: String,
  default: "",
},

mentorGithub: {
  type: String,
  default: "",
},

mentorLinkedin: {
  type: String,
  default: "",
},

openToReferral: {
  type: Boolean,
  default: false,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);