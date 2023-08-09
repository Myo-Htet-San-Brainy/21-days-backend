//packages
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

//imports
const connectDB = require("./db/connectDb");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const User = require("./models/userModel");
const Habit = require("./models/habitModel");
const RefreshToken = require("./models/refreshTokenModel");
const {
  sixAMCron,
  twelvePMCron,
  sixPMCron,
} = require("./cron/checkAndMessageCron");
// To delete
const sendEmail = require("./utils/Emails/SendReminder");

//router imports
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const habitRouter = require("./routers/habitRouter");

//middleware
app.use(morgan("tiny"));
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: "https://zapier.com" }));
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
cloudinary.config({
  cloud_name: "dhwwdk7uq",
  api_key: "517523146221913",
  api_secret: "FhiJvs14ht4YLtiikD7Sma0U89o",
});

//routes
app.get("/api/v1/home", async (req, res) => {
  await sendEmail();

  res.send("good");
});
app.use("/api/v1/habit/", habitRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/auth/", authRouter);
//temp routes
app.delete("/api/v1/deleteAll", async (req, res) => {
  //delete all
  await User.deleteMany({});
  await Habit.deleteMany({});
  await RefreshToken.deleteMany({});
  //remove cookies
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.send("Deleted All.");
});

//lower order middleware
app.use(notFound);
app.use(errorHandler);

//start the app
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });

    //run crons
    sixAMCron.start();
    twelvePMCron.start();
    sixPMCron.start();
  } catch (error) {
    console.log(error);
  }
};
start();
