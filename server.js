const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const app = require("./app");
const Machine = require("./models/machineModel");
const machineDataController = require("./controllers/machineDataController");
const MQTTClientManager = require("./controllers/mqttClientManager");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

// // Load SSL certificate and key
// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
const io = socketIo(server);

// io.on("connection", (socket) => {
//   console.log("user connected");
//   // socket.on("userDetails", (user) => {
//   //   console.log("User connected:", user);
//   // });


//   // Log when a user disconnects
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });



// io.on('connection', (socket) => {
//   console.log('Client connected');

//   // Simulate sensor data
//   setInterval(() => {
//     const data = {
//       value: Math.floor(Math.random() * 100) // Random value between 0 and 100
//     };
//     console.log('Emitting sensorData:', data); // Log the emitted data
//     socket.emit('sensorData', data);
//   }, 1000); // Send data every second

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });


// Initialize MQTT client manager
const clientManager = new MQTTClientManager(io);

// Watch for changes in the database and update connections
Machine.watch().on("change", (change) => {
  clientManager.handleChanges(change);
});

// Initial setup: Connect to MQTT for existing Machines
Machine.find({}).then((machines) => {
  machines.forEach((machine) => clientManager.connect(machine.id));
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
