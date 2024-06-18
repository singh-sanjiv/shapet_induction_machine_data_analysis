const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    machineName: {
      type: String,
      required: [true, "Machine Name can not be empty!"],
      unique: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Machine must belong to a user"],
    },
    // mqtt_ClientID: {
    //   type: String,
    //   required: [true, "Client ID can not be empty!"],
    // },
    mqtt_Username: {
      type: String,
      // required: [true, "Username ID can not be empty!"],
    },
    mqtt_password: {
      type: String,
      // required: [true, "Client ID can not be empty!"],
    },
    topics: {
      type: [
        {
          type: String,
          // enum: [
          //   "sensors/rtd1",
          //   "sensors/rtd2",
          //   "sensors/rtd3",
          //   "sensors/tc",
          //   "sensors/curr1",
          //   "sensors/curr2",
          //   "sensors/dcv",
          // ],
        },
      ],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // },
);

// machineSchema.index({ machine: 1, user: 1 }, { unique: true });

// machineSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "name",
//   });

  //   this.populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });
  //   next();
// });

const Machine = mongoose.model("Machine", machineSchema);
module.exports = Machine;
