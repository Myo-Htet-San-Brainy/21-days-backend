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
      ref: "User",
    },
    username: {
      type: String,
      required: [true, "Please provide the habit creator name."],
    },
    userImage: {
      type: String,
      required: [true, "Please provide the habit creator image."],
    },
    userEmail: {
      type: String,
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
