//packages
const express = require("express");
const router = express.Router();

//imports
const {
  showCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
  updateCurrentUserPassword,
  showLeaderBoard,
  getSingleUser,
  uploadMyImage,
  showCurrentUserAndItsHabits,
} = require("../controllers/userController");
const authorizeUser = require("../middleware/authorization");

router.get("/showCurrentUser", authorizeUser, showCurrentUser);
router.get(
  "/showCurrentUserAndItsHabits",
  authorizeUser,
  showCurrentUserAndItsHabits
);
router.get("/showLeaderBoard", authorizeUser, showLeaderBoard);
router.delete("/deleteCurrentUser", authorizeUser, deleteCurrentUser);
router.patch("/updateCurrentUser", authorizeUser, updateCurrentUser);
router.patch(
  "/updateCurrentUserPassword",
  authorizeUser,
  updateCurrentUserPassword
);
router.route("/uploadMyImage").post(authorizeUser, uploadMyImage);
router.get("/:id", authorizeUser, getSingleUser);

module.exports = router;
