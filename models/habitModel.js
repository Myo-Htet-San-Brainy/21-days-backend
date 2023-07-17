const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  habitTitle: {
    type: String,
    required: [true, "Please provide habit title."],
    trim: true,
  },
  habitDescription: {
    type: String,
    required: [true, "Habit Description can't be null"],
    default: "Description about the habit",
  },
  startDate: {
    type: Date,
    required: [true, "Please provide habit start date."],
  },
  completionDate: {
    type: Date,
    required: [true, "Please provide habit completion date."],
  },
  habitStatus: {
    type: String,
    required: [true, "Habit Status can't be null"],
    default: "Building",
    enum: {
      values: ["Building", "Built"],
      message: "{VALUE} is not supported.",
    },
  },
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide the habit creator."],
      // default: new mongoose.Types.ObjectId("64aa649eda1d5f341385ad89"),
      ref: "User",
    },
    username: {
      type: String,
      required: [true, "Please provide the habit creator name."],
      // default: "soungoolwin",
    },
    userImage: {
      type: String,
      required: [true, "Please provide the habit creator image."],
      // default:
      //   "https://res.cloudinary.com/dhwwdk7uq/image/upload/v1689521881/21daysUserImages/tmp-1-1689521878862_bvnlaf.jpg",
    },
    userEmail: {
      type: String,
      // default: "soungoolwin275@gmail.com",
    },
  },
  timeToSendReminder: {
    type: String,
    required: [true, "Please provide habit start date."],
    enum: {
      values: ["6am", "12pm", "6pm"],
      message: "{VALUE} is not supported.",
    },
  },
});

module.exports = mongoose.model("Habit", habitSchema);
