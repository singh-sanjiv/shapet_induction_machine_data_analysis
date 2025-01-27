const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
// const xss = require('xss-clean');
// const webPush = require('web-push');
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const tokenRouter = require("./routes/tokenRoutes");
const machineRouter = require("./routes/machineRoutes");
const machineDataRouter = require("./routes/machineDataRoutes");
const viewRouter = require("./routes/viewRoutes");

// Start express app
const app = express();

// app.enable("trust proxy");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// app.use(cors({
//   origin: 'https://www'
// }))

app.options("*", cors());
app.options("/resetPassword/:otp", cors());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
// app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["rtd1", "rtd2", "rtd3", "tc", "curr1", "curr2", "dcv"],
  }),
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use("/", viewRouter);
app.use("/api/v1/machine", machineRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/token", tokenRouter);
app.use("/api/v1/machineData", machineDataRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
