//packages
const { StatusCodes } = require("http-status-codes");

//imports
const Habit = require("../models/habitModel");
const User = require("../models/userModel");
const customError = require("../errors");
const checkOwner = require("../utils/checkOwner");

const getAllHabits = async (req, res) => {
  let habit = Habit.find({}).select("-timeToSendReminder -user.userEmail");
  //pagination
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  habit = habit.skip(skip).limit(limit);

  const habits = await habit;
  res.status(StatusCodes.OK).json({ count: habits.length, data: habits });
};

const createHabit = async (req, res) => {
  //check for things user must not provide
  if (req.body.completionDate) {
    throw new customError.Unauthorized(
      "completionDate is not allowed to add by user!"
    );
  }
  if (req.body.habitStatus) {
    throw new customError.Unauthorized(
      "habitStatus is not allowed to add by user!"
    );
  }
  if (req.body.user) {
    throw new customError.Unauthorized("User is not allowed to add by user!");
  }

  //add user
  const user = await User.findById(req.user.userId);

  req.body.user = {
    userId: user._id,
    username: user.username,
    userImage: user.image,
    userEmail: user.email,
  };
  //add completion date
  const startDateObj = new Date(req.body.startDate);
  const completionDateObj = new Date(
    startDateObj.getTime() + 20 * 24 * 60 * 60 * 1000 //milliseconds for 20 days
  );
  req.body.completionDate = completionDateObj;
  req.body.startDate = startDateObj;
  // console.log(
  //   `completion: ${typeof req.body.completionDate}, ${req.body.completionDate}`
  // );
  // console.log(`start: ${typeof req.body.startDate}, ${req.body.startDate}`);

  //create Habit
  await Habit.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "Created A Habit" });
};

const getMyHabits = async (req, res) => {
  const habits = await Habit.find({ "user.userId": req.user.userId }).select(
    "-user"
  );
  res.status(StatusCodes.OK).json({ data: habits, message: "My Habits" });
};

const deleteHabit = async (req, res) => {
  const { id: habitId } = req.params;
  const habit = await Habit.findOne({ _id: habitId });

  if (!habit) {
    throw new customError.NotFound(`No habit with id : ${habitId}`);
  }
  //check permission
  checkOwner(req.user, habit.user.userId);

  await Habit.findByIdAndDelete(habit._id);
  res.status(StatusCodes.OK).json({ message: "Deleted A Habit" });
};

module.exports = {
  getAllHabits,
  getMyHabits,
  createHabit,
  deleteHabit,
};
