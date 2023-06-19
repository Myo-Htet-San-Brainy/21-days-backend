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

module.exports = {
  createUser,
};
