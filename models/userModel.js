const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username."],
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
  image: {
    type: String,
    time: true,
    default: "user.jpeg",
    //required is just here to check for null
    required: [true, "Null value is not allowed for image field."],
  },
  bio: {
    type: String,
    maxLength: 100,
    time: true,
    default: "no bio",
  },
  habitsBuilt: {
    type: Number,
    default: 0,
  },
  facebookId: {
    type: String,
    required: [true, "Please provide facebookId."],
  },
  //pass reset part
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpirationDate: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
