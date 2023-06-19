//packages
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
});

//imports
const { facebookLogin, logout } = require("../controllers/authController");
const authorizeUser = require("../middleware/authorization");

router.post("/facebookLogin", rateLimiter, facebookLogin);
router.delete("/logout", authorizeUser, logout);

module.exports = router;
