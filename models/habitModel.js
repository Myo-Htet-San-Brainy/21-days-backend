const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    habitTitle: {
      type: String,
      required: [true, "Please provide habit title."],
      trim: true,
    },
    habitDescription: {
      type: String,
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
        // default: new mongoose.Types.ObjectId("64bfed55b66ab8b2330f168b"),
        ref: "User",
      },
      username: {
        type: String,
        required: [true, "Please provide the habit creator name."],
        // default: "SVI",
      },
      userImage: {
        type: String,
        required: [true, "Please provide the habit creator image."],
        // default:
        //   "https://res.cloudinary.com/dhwwdk7uq/image/upload/v1690299918/21daysUserImages/tmp-3-1690299917153_sltf5m.jpg",
      },
      userEmail: {
        type: String,
        // default: "saiphone@gmail.com",
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Habit", habitSchema);
