//packages
const express = require("express");
const router = express.Router();

//imports
const {
  createUser,
  showCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
  showLeaderBoard,
  getSingleUser,
} = require("../controllers/userController");
const authorizationForCreateUser = require("../middleware/authorizationForCreateUser");
const authorizeUser = require("../middleware/authorization");

router.post("/createUser", authorizationForCreateUser, createUser);
router.get("/showCurrentUser", authorizeUser, showCurrentUser);
router.get("/showLeaderBoard", authorizeUser, showLeaderBoard);
router.delete("/deleteCurrentUser", authorizeUser, deleteCurrentUser);
router.patch("/updateCurrentUser", authorizeUser, updateCurrentUser);
router.get("/:id", authorizeUser, getSingleUser);

module.exports = router;
