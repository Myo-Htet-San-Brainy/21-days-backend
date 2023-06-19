//packages
const { StatusCodes } = require("http-status-codes");

//imports

const getAllHabits = async (req, res) => {
  res.status(StatusCodes.OK).json({ data: {}, message: "All Habits" });
};

const createHabit = async (req, res) => {
  res
    .status(StatusCodes.CREATED)
    .json({ data: {}, message: "Created A Habit" });
};

const getMyHabits = async (req, res) => {
  res.status(StatusCodes.OK).json({ data: {}, message: "My Habits" });
};

const deleteHabit = async (req, res) => {
  res.status(StatusCodes.OK).json({ data: {}, message: "Deleted A Habit" });
};

module.exports = {
  getAllHabits,
  getMyHabits,
  createHabit,
  deleteHabit,
};
