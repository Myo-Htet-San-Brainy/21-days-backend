const cron = require("cron");
const Habit = require("../models/habitModel");
const User = require("../models/userModel");
const sendReminderEmail = require("../utils/Emails/SendReminder");

const sixAMCron = new cron.CronJob(
  "20 22 * * *",
  async function () {
    try {
      console.log("about to send reminder");
      // Getting the right habits
      const currentDate = new Date(Date.now());
      currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00
      let habits = await Habit.find({
        habitStatus: "Building",
        timeToSendReminder: "6am",
      });
      console.log(`habits after first stage filtering ${habits}`);

      habits = habits.filter((habit) => {
        const habitStartDate = new Date(habit.startDate);
        habitStartDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

        if (habitStartDate <= currentDate) {
          return habit;
        }
      });
      console.log(`habits after second stage filtering ${habits}`);

      // Checking if completed, sending reminders, updating status if completed, updating user's habitsBuilt
      habits.forEach(async function (habit) {
        try {
          const habitCompletionDate = new Date(habit.completionDate);
          habitCompletionDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00
          console.log("right before sending habit");
          if (currentDate >= habitCompletionDate) {
            //updating status
            habit.habitStatus = "Built";
            await habit.save();
            //updating user's habitsBuilt
            const habitOwner = await User.findById(habit.user.userId);
            habitOwner.habitsBuilt += 1;
            await habitOwner.save();
            console.log("right before sending final habit reminder");

            //sending message
            const reminderMessage = `This is the last and final reminder to : ${habit.habitTitle}.
            You have been doing so amazing and give this your best shot! Stay hard!`;
            await sendReminderEmail(
              habit.user.username,
              habit.user.userEmail,
              reminderMessage
            );
          } else {
            console.log("right before sending normal habit reminder");

            const reminderMessage = `I am here to remind you of the habit you set up: ${habit.habitTitle}.
      This is your grind and keep it up!`;
            await sendReminderEmail(
              habit.user.username,
              habit.user.userEmail,
              reminderMessage
            );
          }
        } catch (error) {
          console.error("Error in processing habit:", error);
        }
      });
    } catch (error) {
      console.error("Error in sixAMCron:", error);
    }
  },
  { timezone: "Asia/Bangkok" }
);

const twelvePMCron = new cron.CronJob(
  "0 0 12 * * *",
  async function () {
    try {
      // Getting the right habits
      const currentDate = new Date(Date.now());
      currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00
      let habits = await Habit.find({
        habitStatus: "Building",
        timeToSendReminder: "12pm",
      });
      habits = habits.filter((habit) => {
        const habitStartDate = new Date(habit.startDate);
        habitStartDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

        if (habitStartDate <= currentDate) {
          return habit;
        }
      });

      // Checking if completed, sending reminders, updating status if completed
      habits.forEach(async function (habit) {
        try {
          const habitCompletionDate = new Date(habit.completionDate);
          habitCompletionDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00
          if (currentDate >= habitCompletionDate) {
            habit.habitStatus = "Built";
            await habit.save();
            //updating user's habitsBuilt
            const habitOwner = await User.findById(habit.user.userId);
            habitOwner.habitsBuilt += 1;
            await habitOwner.save();
            const reminderMessage = `This is the last and final reminder to : ${habit.habitTitle}.
            You have been doing so amazing and give this your best shot! Stay hard!`;
            await sendReminderEmail(
              habit.user.username,
              habit.user.userEmail,
              reminderMessage
            );
          } else {
            const reminderMessage = `I am here to remind you of the habit you set up: ${habit.habitTitle}.
      This is your grind and keep it up!`;
            await sendReminderEmail(
              habit.user.username,
              habit.user.userEmail,
              reminderMessage
            );
          }
        } catch (error) {
          console.error("Error in processing habit:", error);
        }
      });
    } catch (error) {
      console.error("Error in sixAMCron:", error);
    }
  },
  { timezone: "Asia/Bangkok" }
);

const sixPMCron = new cron.CronJob(
  "0 0 18 * * *",
  async function () {
    try {
      // Getting the right habits
      const currentDate = new Date(Date.now());
      currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00
      let habits = await Habit.find({
        habitStatus: "Building",
        timeToSendReminder: "6pm",
      });
      habits = habits.filter((habit) => {
        const habitStartDate = new Date(habit.startDate);
        habitStartDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

        if (habitStartDate <= currentDate) {
          return habit;
        }
      });

      // Checking if completed, sending reminders, updating status if completed
      habits.forEach(async function (habit) {
        try {
          const habitCompletionDate = new Date(habit.completionDate);
          habitCompletionDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00
          if (currentDate >= habitCompletionDate) {
            habit.habitStatus = "Built";
            await habit.save();
            //updating user's habitsBuilt
            const habitOwner = await User.findById(habit.user.userId);
            habitOwner.habitsBuilt += 1;
            await habitOwner.save();
            const reminderMessage = `This is the last and final reminder to : ${habit.habitTitle}.
            You have been doing so amazing and give this your best shot! Stay hard!`;
            await sendReminderEmail(
              habit.user.username,
              habit.user.userEmail,
              reminderMessage
            );
          } else {
            const reminderMessage = `I am here to remind you of the habit you set up: ${habit.habitTitle}.
      This is your grind and keep it up!`;
            await sendReminderEmail(
              habit.user.username,
              habit.user.userEmail,
              reminderMessage
            );
          }
        } catch (error) {
          console.error("Error in processing habit:", error);
        }
      });
    } catch (error) {
      console.error("Error in sixAMCron:", error);
    }
  },
  { timezone: "Asia/Bangkok" }
);

module.exports = {
  sixAMCron,
  twelvePMCron,
  sixPMCron,
};
