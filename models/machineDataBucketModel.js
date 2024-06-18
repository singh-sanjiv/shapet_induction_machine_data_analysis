const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  value: { type: Number, required: true }
});

const machineDataSchema = new mongoose.Schema({
  machineId: { type: mongoose.Schema.Types.ObjectId, required: true },
  topic: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  measurements: [measurementSchema],
  transaction_count: { type: Number, required: true },
  sum_value: { type: Number, required: true }
});

const Bucket  = mongoose.model("Bucket", machineDataSchema);

module.exports = Bucket;
