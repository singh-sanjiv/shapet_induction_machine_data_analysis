const express = require("express");
const machineController = require("../controllers/machineController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(machineController.getAllMachine)
  .post(
    authController.restrictTo("admin"),
    machineController.setMachineUserIds,
    machineController.createMachine,
  );

router
  .route("/:id")
  .patch(authController.restrictTo("admin"), machineController.updateMachine)
  .delete(authController.restrictTo("admin"), machineController.deleteMachine);

module.exports = router;
