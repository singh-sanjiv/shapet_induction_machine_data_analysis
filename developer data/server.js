const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const dbUri = 'mongodb+srv://sanjivnsingh007:rsdjGPjNUAvt2Ry6@cratosdb.8apiyhq.mongodb.net/Shapet?retryWrites=true&w=majority&appName=Cratosdb';

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to the database');

  try {
    // Drop the unique index on machineID
    await db.collection('machinedatas').dropIndex('machineID_1_sensorType_1');
    console.log('Dropped unique index on machineID');

    // Close the database connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error dropping index:', err);
    mongoose.connection.close();
  }
});
