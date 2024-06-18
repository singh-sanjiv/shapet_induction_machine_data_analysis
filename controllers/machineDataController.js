const MachineData = require("../models/machineDataBucketModel");
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
exports.getAllMachinesData = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(MachineData.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const machineData = await features.query;

  const formattedData = machineData.map(data => ({
    _id: data._id,
    machineId: data.machineID,
    topic: data.topic,
    start_date: data.startDate,
    end_date: data.endDate,
    measurements: data.measurements,
    transaction_count: data.transactionCount,
    sum_temperature: data.sumTemperature
  }));

  res.status(200).json({
    status: 'success',
    results: machineData.length,
    data: {
      machineData: formattedData
    }
  });
});

exports.createMachineData = async (req, res, next) => {
  try {
    console.log("Received request to create machine data:", req.body);

    // Assuming you have a MachineData model
    const machineData = await MachineData.create(req.body);

    console.log("Machine data stored successfully:", machineData);

    res.status(201).json({
      status: 'success',
      data: {
        machineData
      }
    });
  } catch (error) {
    console.error("Error creating machine data:", error);
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};
