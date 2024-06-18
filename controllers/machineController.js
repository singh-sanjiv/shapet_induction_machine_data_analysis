const Machine = require("../models/machineModel");
const factory = require("./handlerFactory");
// const catchAsync = require('./../utils/catchAsync');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.setMachineUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.machine) req.body.machine = req.params.machineId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllMachine = factory.getAll(Machine);
exports.createMachine = factory.createOne(Machine);
exports.updateMachine = factory.updateOne(Machine);
exports.deleteMachine = factory.deleteOne(Machine);
