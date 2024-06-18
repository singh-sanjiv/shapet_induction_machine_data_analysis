// const Tour = require("../models/tourModel");
const User = require("../models/userModel");
// const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// exports.alerts = (req, res, next) => {
//   const { alert } = req.query;
//   if (alert === "booking")
//     res.locals.alert =
//       "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
//   next();
// };

// exports.getOverview = catchAsync(async (req, res, next) => {
//   // 1) Get tour data from collection
//   const tours = await Tour.find();

//   // 2) Build template
//   // 3) Render that template using tour data from 1)
//   res.status(200).render("overview", {
//     title: "All Tours",
//     tours,
//   });
// });

exports.index = catchAsync(async (req, res, next) => {
  res.status(200).render("index");
});

exports.contact = catchAsync(async (req, res, next) => {
  res.status(200).render("contact");
});


exports.dashboard = catchAsync(async (req, res, next) => {
  // console.log(res.locals.user.role);
  

  
// const role  = JSON.stringify(res.locals.user.role);
// console.log(role);

  // if (res.locals.user.role === "admin") {
  //   res.redirect('/admin/dashboard');
  // } else {
    res.status(200).render("dashboard", {
      user: res.locals.user,
      photo: res.locals.user.photo,
    });
  // } 
});


exports.generatereport = catchAsync(async (req, res, next) => {
  // console.log(res.locals.user.name);
  res.status(200).render("generate-report", {
    user: res.locals.user,
    photo: res.locals.user.photo,
  });
});

// exports.generatereport = catchAsync(async (req, res, next) => {
//   // console.log(res.locals.user.name);
//   res.status(200).render("generate-report", {
//     user: res.locals.user,
//     photo: res.locals.user.photo,
//   });
// });

exports.historicaldata = catchAsync(async (req, res, next) => {
  // console.log(res.locals.user.name);
  res.status(200).render("historical-data", {
    user: res.locals.user,
    photo: res.locals.user.photo,
  });
});

exports.machinedetails = catchAsync(async (req, res, next) => {
  // console.log(res.locals.user.name);
  res.status(200).render("machine-details", {
    user: res.locals.user,
    photo: res.locals.user.photo,
  });
});

exports.notifications = catchAsync(async (req, res, next) => {
  // console.log(res.locals.user.name);
  res.status(200).render("notification", {
    user: res.locals.user,
    photo: res.locals.user.photo,
  });
});

exports.allusers = catchAsync(async (req, res, next) => {
  // console.log(res.locals.user.name);
  res.status(200).render("allusers", {
    user: res.locals.user,
    photo: res.locals.user.photo,
  });
});

exports.createusers = catchAsync(async (req, res, next) => {
  // console.log(res.locals.user.name);
  res.status(200).render("createusers", {
    user: res.locals.user,
    photo: res.locals.user.photo,
  });
});

// exports.getTour = catchAsync(async (req, res, next) => {
//   // 1) Get the data, for the requested tour (including reviews and guides)
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: "reviews",
//     fields: "review rating user",
//   });

//   if (!tour) {
//     return next(new AppError("There is no tour with that name.", 404));
//   }

//   // 2) Build template
//   // 3) Render template using data from 1)
//   res.status(200).render("tour", {
//     title: `${tour.name} Tour`,
//     tour,
//   });
// });

exports.getLoginForm = (req, res) => {
  res.status(200).render("login");
};
exports.forgotPassword = (req, res) => {
  res.status(200).render("forgotPassword");
};
exports.myaccount = (req, res) => {
  res.status(200).render("my-account");
};

exports.renderResetPasswordForm  = (req, res) => {
    res.status(200).render("resetPassword", {
     otp: req.params.otp });
};

