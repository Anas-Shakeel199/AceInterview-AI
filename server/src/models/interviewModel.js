import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
  }
);

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Interview title is required"],
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    jobRole: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    experienceLevel: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["Fresher", "Junior", "Mid", "Senior"],
    },

    interviewType: {
      type: String,
      required: [true, "Interview type is required"],
      enum: [
        "Frontend",
        "Backend",
        "Full Stack",
        "HR",
        "DSA",
        "System Design",
      ],
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    techStack: [
      {
        type: String,
        trim: true,
      },
    ],

    totalQuestions: {
      type: Number,
      default: 10,
      min: 5,
      max: 30,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "generated",
        "in_progress",
        "completed",
      ],
      default: "pending",
    },

    startedAt: {

      type: Date,

      default: null,

    },
    
    completedAt: {
      type: Date,
      default: null,
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;