//packages
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//imports
const connectDB = require("./db/connectDb");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const authorizeUser = require("./middleware/authorization");
const User = require("./models/userModel");
const RefreshToken = require("./models/refreshTokenModel");

//router imports
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const habitRouter = require("./routers/habitRouter");

//middleware
app.use(morgan("tiny"));
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//routes
app.use("/api/v1/habit/", habitRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/auth/", authRouter);
app.get("/", async (req, res) => {
  res.send("hi mom");
});
//temp routes
app.delete("/api/v1/deleteAll", async (req, res) => {
  //delete all
  await User.deleteMany({});
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
  } catch (error) {
    console.log(error);
  }
};
start();
