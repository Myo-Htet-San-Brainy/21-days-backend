//packages
const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
//imports
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const { attachCookiesToResponse } = require("../utils/jwt");
const createUserPayload = require("../utils/createUserPayload");

const facebookLogin = async (req, res, next) => {
  //getting fbId using accessTokenForUser
  const { accessTokenForUser } = req.body;
  const fbRes = await axios.get(
    `https://graph.facebook.com/v12.0/me?fields=id&access_token=${accessTokenForUser}`
  );
  const facebookId = fbRes.data.id;
  // console.log(`facebookId: ${facebookId}`);
  //differentiating Login and Register
  const existingUser = await User.findOne({
    facebookId: facebookId,
  });
  // console.log(`existingUser: ${existingUser}`);

  if (existingUser) {
    login(req, res, next, existingUser);
  } else {
    register(req, res, next, facebookId);
  }
};

const login = async (req, res, next, existingUser) => {
  try {
    const refreshTokenDoc = await RefreshToken.findOne({
      user: existingUser._id,
    });

    const { isValid, refreshToken } = refreshTokenDoc;
    //isValid check is here just because if sites admin become sus of a user, they can change this 'isValid' to false and that one user wouldn't be able to login forever
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    //giving authorization to user
    const userPayload = createUserPayload(existingUser);
    attachCookiesToResponse(res, userPayload, refreshToken);
    res.status(StatusCodes.OK).json({ message: "Show User Habit feed." });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next, facebookId) => {
  try {
    //setup fbId cookie
    const fbIdJWT = jwt.sign(facebookId, process.env.JWT_SECRET);
    res.cookie("namasamethe", fbIdJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      maxAge: 60 * 60 * 1000,
    });
    //res
    res.status(StatusCodes.OK).json({ message: "Ask user info." });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  //removing cookies
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ message: "user logged out!" });
};

module.exports = {
  facebookLogin,
  logout,
};
