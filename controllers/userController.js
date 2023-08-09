//packages
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const sharp = require("sharp");
const convert = require("heic-convert");
const { promisify } = require("util");
//imports
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const Habit = require("../models/habitModel");
const { attachCookiesToResponse } = require("../utils/jwt");
const createUserPayload = require("../utils/createUserPayload");
const customError = require("../errors");
// To delete(two places in total)
const sendReminder = require("../utils/Emails/SendReminder");

const showCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "username image bio habitsBuilt email _id"
  );
  res.status(StatusCodes.OK).json({ data: user, message: "Current User" });
};

const showCurrentUserAndItsHabits = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "username image bio habitsBuilt email _id"
  );
  const habits = await Habit.find({ "user.userId": req.user.userId })
    .select("-user")
    .sort({ createdAt: -1 });
  res
    .status(StatusCodes.OK)
    .json({ user, habits, message: "Current User With Its Habits" });
};

const deleteCurrentUser = async (req, res) => {
  //delete current user
  const user = await User.findByIdAndDelete(req.user.userId).select("_id");
  //delete refresh token
  const refreshToken = await RefreshToken.findOneAndDelete({ user: user._id });
  //delete habits
  const habits = await Habit.deleteMany({ "user.userId": user._id });
  //remove two cookies
  res.cookie("accessToken", "delete acc", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "delete acc", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "Deleted Current User" });
};

const updateCurrentUser = async (req, res) => {
  const { username, bio, image } = req.body;
  //update current user
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { username, bio, image },
    {
      runValidators: true,
      new: true,
    }
  ).select("username image bio habitsBuilt _id");
  //update user info in habits
  const habits = await Habit.updateMany(
    { "user.userId": user._id },
    {
      "user.username": user.username,
      "user.userImage": user.image,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({ data: user, message: "Updated Current User" });
};

const updateCurrentUserPassword = async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.user.userId);
  user.password = newPassword;
  user.save();
  res.status(StatusCodes.OK).json({
    message:
      "Updated Current User's Password. Use the new password next time you login in(sign in).",
  });
};

const showLeaderBoard = async (req, res) => {
  const users = await User.find({ isVerified: true })
    .select("_id username image habitsBuilt")
    .sort("-habitsBuilt")
    .limit(10);
  res.status(StatusCodes.OK).json({ data: users, message: "LeaderBoard" });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId).select(
    "username image bio habitsBuilt"
  );
  if (!user) {
    throw new customError.NotFound(`No user found with such id: ${userId}.`);
  }
  res.status(StatusCodes.OK).json({ data: user, message: "Single User" });
};

const uploadMyImage = async (req, res) => {
  try {
    //check type
    const myImage = req.files.image;
    if (!myImage.mimetype.startsWith("image")) {
      throw new customError.BadRequest("Please upload image file.");
    }
    console.log("passed type check");

    //convert path to buffer
    var inputBuffer = await promisify(fs.readFile)(myImage.tempFilePath);

    // convert heic
    //if not .heic, skip this step
    const imageFormat = myImage.mimetype.split("/")[1];
    if (imageFormat === "heic") {
      console.log("before converting to jpeg buffer");
      inputBuffer = await convert({
        buffer: inputBuffer, // the HEIC file buffer
        format: "JPEG", // output format
      });
      console.log("after convertion");
    }
    console.log(inputBuffer);

    //compress image file
    const compressedImage = await sharp(inputBuffer)
      .resize({ width: 1200 })
      .jpeg({ quality: 80 })
      .toBuffer();
    console.log(`compressed buffer: ${compressedImage}`);

    //check size
    if (compressedImage.length > 10 * 1024 * 1024) {
      return res
        .status(400)
        .json({ error: "Image size exceeds the platform limit of 10 MB." });
    }
    console.log("passed check size");

    // Upload the compressed image to Cloudinary with the specified options
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          use_filename: true,
          folder: "21daysUserImages",
        },
        (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Error uploading image to Cloudinary." });
          }

          // Remove the temporary file after successful upload
          fs.unlinkSync(req.files.image.tempFilePath);

          return res.status(StatusCodes.OK).json({ data: result.secure_url });
        }
      )
      .end(compressedImage);
  } catch (error) {
    return res.status(500).json({ error: "Error processing the image." });
  }
};

const emailSendTesting = async (req, res) => {
  await sendReminder();
  console.log("Reminder Sent");
};

module.exports = {
  showCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
  updateCurrentUserPassword,
  showLeaderBoard,
  getSingleUser,
  uploadMyImage,
  showCurrentUserAndItsHabits,
  emailSendTesting,
};

// const createUser = async (req, res) => {
//   //check for things user must not provide
//   if (req.body.habitsBuilt) {
//     throw new customError.Unauthorized(
//       "HabitsBuilt is not allowed to add by user!"
//     );
//   }
//   //create user
//   const user = await User.create(req.body);
//   //create refresh token
//   refreshToken = crypto.randomBytes(40).toString("hex");
//   const userAgent = req.headers["user-agent"];
//   const ip = req.ip;
//   const refreshTokenDoc = { refreshToken, ip, userAgent, user: user._id };
//   await RefreshToken.create(refreshTokenDoc);
//   //attach cookies,aka, giving authorization
//   const userPayload = createUserPayload(user);
//   attachCookiesToResponse(res, userPayload, refreshToken);
//   //since everything successful, clear fbId cookie
//   res.cookie("namasamethe", "clearing namasamethe", {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//   });
//   res.status(StatusCodes.CREATED).json({ message: "Show user habit feed." });
// };
