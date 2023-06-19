//packages
const express = require("express");
const router = express.Router();

//imports
const {
  getAllHabits,
  getMyHabits,
  createHabit,
  deleteHabit,
} = require("../controllers/habitController");
const authorizeUser = require("../middleware/authorization");

router.get("/getAllHabits", authorizeUser, getAllHabits);
router.get("/getMyHabits", authorizeUser, getMyHabits);
router.post("/createHabit", authorizeUser, createHabit);
router.delete("/:id", authorizeUser, deleteHabit);

module.exports = router;
