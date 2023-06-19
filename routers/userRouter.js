//packages
const express = require("express");
const router = express.Router();

//imports
const { createUser } = require("../controllers/userController");
const authorizationForCreateUser = require("../middleware/authorizationForCreateUser");
const authorizeUser = require("../middleware/authorization");

router.post("/createUser", authorizationForCreateUser, createUser);

module.exports = router;
