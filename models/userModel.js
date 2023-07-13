const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    default:
      "https://res.cloudinary.com/dhwwdk7uq/image/upload/v1689238366/21daysUserImages/tmp-2-1689238361206_jhx42p.png",
    //required is just here to check for null
    required: [true, "Null value is not allowed for image field."],
  },
  bio: {
    type: String,
    maxLength: 100,
    time: true,
    default: "no bio",
    //required is just here to check for null
    required: [true, "Null value is not allowed for bio field."],
  },
  habitsBuilt: {
    type: Number,
    default: 0,
    //required is just here to check for null
    required: [true, "Null value is not allowed for habitsBuilt field."],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  //verification part
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  //reset password part
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
