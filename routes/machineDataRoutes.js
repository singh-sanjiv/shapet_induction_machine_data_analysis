const express = require("express");
const machineDataController = require("../controllers/machineDataController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(
    authController.restrictTo('user'),
    machineDataController.getAllMachinesData,
  );

// router
//   .route("/:id")
//   .get(
//     authController.restrictTo("user", "admin"),
//     machineDataController.getMachineData,
//   )
// .delete(
//     authController.restrictTo("admin"),
//     machineDataController.deleteMachineData,
//   );

module.exports = router;
