//packages
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
//imports
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const { attachCookiesToResponse } = require("../utils/jwt");
const createUserPayload = require("../utils/createUserPayload");

const createUser = async (req, res) => {
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
  res
    .status(StatusCodes.CREATED)
    .json({ data: user, message: "Show user habit feed." });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ data: {}, message: "Current User" });
};

const deleteCurrentUser = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ data: {}, message: "Deleted Current User" });
};

const updateCurrentUser = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ data: {}, message: "Updated Current User" });
};

const showLeaderBoard = async (req, res) => {
  res.status(StatusCodes.OK).json({ data: {}, message: "LeaderBoard" });
};

const getSingleUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ data: {}, message: "Single User" });
};

module.exports = {
  createUser,
  showCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
  showLeaderBoard,
  getSingleUser,
};
