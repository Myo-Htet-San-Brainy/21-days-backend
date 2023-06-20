const customError = require("../errors");

const checkOwner = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new customError.Unauthorized(
    "Not authorized to access do this or to access this route."
  );
};

module.exports = checkOwner;
