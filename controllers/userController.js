//packages
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
//imports
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const Habit = require("../models/habitModel");
const { attachCookiesToResponse } = require("../utils/jwt");
const createUserPayload = require("../utils/createUserPayload");
const customError = require("../errors");

const createUser = async (req, res) => {
  //check for things user must not provide
  if (req.body.habitsBuilt) {
    throw new customError.Unauthorized(
      "HabitsBuilt is not allowed to add by user!"
    );
  }
  //create user
  const user = await User.create(req.body);
  //create refresh token
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const refreshTokenDoc = { refreshToken, ip, userAgent, user: user._id };
  await RefreshToken.create(refreshTokenDoc);
  //attach cookies,aka, giving authorization
  const userPayload = createUserPayload(user);
  attachCookiesToResponse(res, userPayload, refreshToken);
  //since everything successful, clear fbId cookie
  res.cookie("namasamethe", "clearing namasamethe", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.CREATED).json({ message: "Show user habit feed." });
};

const showCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-facebookId");
  res.status(StatusCodes.OK).json({ data: user, message: "Current User" });
};

const deleteCurrentUser = async (req, res) => {
  //delete current user
  const user = await User.findByIdAndDelete(req.user.userId).select(
    "-facebookId"
  );
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
  //check for things user must not provide
  if (req.body.habitsBuilt) {
    throw new customError.Unauthorized("HabitsBuilt is not allowed to update!");
  }
  if (req.body.facebookId) {
    throw new customError.Unauthorized("FacebookId is not allowed to update!");
  }
  //update current user
  const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
    runValidators: true,
    new: true,
  }).select("-facebookId");
  //update user info in habits
  const habtis = await Habit.updateMany(
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

const showLeaderBoard = async (req, res) => {
  const users = await User.find({})
    .select("_id username image habitsBuilt")
    .sort("-habitsBuilt")
    .limit(10);
  res.status(StatusCodes.OK).json({ data: users, message: "LeaderBoard" });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId).select("-facebookId");
  if (!user) {
    throw new customError.NotFound(`No user found with such id: ${userId}.`);
  }
  res.status(StatusCodes.OK).json({ data: user, message: "Single User" });
};

module.exports = {
  createUser,
  showCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
  showLeaderBoard,
  getSingleUser,
};
