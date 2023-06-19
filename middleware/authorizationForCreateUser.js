const { isTokenValid } = require("../utils/jwt");
const customError = require("../errors");

const authorizationForCreateUser = (req, res, next) => {
  try {
    //checking authorization
    const { namasamethe } = req.signedCookies;
    const facebookId = isTokenValid(namasamethe);
    req.body.facebookId = facebookId;
    //clearing fbId cookie
    res.cookie("namasamethe", "clearing namasamethe", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    next();
  } catch (error) {
    next(new customError.Unauthorized("Authorization Failed to create user."));
  }
};

module.exports = authorizationForCreateUser;
