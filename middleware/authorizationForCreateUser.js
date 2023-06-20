const { isTokenValid } = require("../utils/jwt");
const customError = require("../errors");

const authorizationForCreateUser = (req, res, next) => {
  try {
    //checking authorization
    const { namasamethe } = req.signedCookies;
    const facebookId = isTokenValid(namasamethe);
    req.body.facebookId = facebookId;
    next();
  } catch (error) {
    next(new customError.Unauthorized("Authorization Failed to create user."));
  }
};

module.exports = authorizationForCreateUser;
