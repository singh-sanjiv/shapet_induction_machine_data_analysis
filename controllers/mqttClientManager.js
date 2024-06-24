const mqtt = require("mqtt");
const Machine = require("../models/machineModel");
const admin = require('firebase-admin');
// const serviceAccount = require('path/to/serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// webPush.setVapidDetails(
//   'mailto:boombrust10@gmail.com',
//   'BOEv8ybBy4PZT5f97f-HrK-Am6e0waL-o2biipvoa_RYg6EOIj9A_Hkm21iSpJWXiDuLzPTG3qvbCkToFWAev30',
//   'HmkmRk4_sbZTB9dMJvO7kvJM6zVNYfzdjIfqjpPy0Uo'
// );

class MQTTClientManager {
  constructor(io) {
    this.clients = new Map();
    this.io = io;
    this.timers = new Map();

    // Listen for user connection status changes
    this.io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("userConnected", async ({ connected, machineId }) => {
        console.log(`User connection status changed: connected=${connected}, machineId=${machineId}`);
        if (connected) {
          await this.connect(machineId, connected);
          this.startAcknowledgementTimer(machineId);
          // const userToken = 'USER_FCM_TOKEN';
          // sendNotification(userToken, 'Temperature Alert', 'Temperature exceeds limit!');
        } else {
          await this.disconnect(machineId);
        }
      });

      socket.on("userDisconnected", async ({ connected, machineId }) => {
        console.log(`User connection status changed: Disconnected=${connected}, machineId=${machineId}`);
        this.disconnect(machineId);
      });

      socket.on("acknowledge", ({ machineId }) => {
        console.log(`Acknowledgement received for machineId=${machineId}`);
        this.resetAcknowledgementTimer(machineId);
      });
    });
  }

  async connect(machineId, connected) {
    try {
      const machine = await Machine.findById(machineId);
      if (!machine) {
        throw new Error(`Machine with id ${machineId} not found`);
      }

      const client = mqtt.connect(process.env.MQTT_HOST);

      client.on("connect", () => {
        console.log(`Connected to MQTT broker for Machine: ${machine.machineName}`);

        // Always subscribe to certain topics
        const alwaysSubscribeTopics = machine.topics.filter(topic => topic.includes("sensors/curr1"));
        alwaysSubscribeTopics.forEach((topic) => {
         
          const parts = topic.split('/');
          const baseTopic = parts[0];
          const sensor = parts[2];
          client.publish(`${baseTopic}/sensors/SET`, `${sensor}/1}`, (err) => {
            if (err) {
              console.error(`Error publishing to topic ${baseTopic}/sensors/SET with message ${sensor}/${status}:`, err);
            } else {
              console.log(`Published to topic ${baseTopic}/sensors/SET with message ${sensor}/1`);
            }
          });

          client.subscribe(topic, (err) => {
            if (err) {
              console.error(`Error subscribing to topic ${topic}:`, err);
            } else {
              console.log(`Subscribed to topic: ${topic}`);
            }
          });
        });

        // Subscribe to conditional topics only if the user is connected
        if (connected) {
          const conditionalSubscribeTopics = machine.topics.filter(topic =>
            topic.includes("sensors/rtd1") ||
            topic.includes("sensors/rtd2") ||
            topic.includes("sensors/rtd3")
          );
          conditionalSubscribeTopics.forEach((topic) => {
            
            this.publishTopic(client, topic, 1);


            client.subscribe(topic, (err) => {
              if (err) {
                console.error(`Error subscribing to topic ${topic}:`, err);
              } else {
                console.log(`Subscribed to conditional topic: ${topic}`);
              }
            });
          });
        }
      });

      client.on("message", (topic, message) => {
        console.log(`Received message on topic ${topic}: ${message.toString()}`);
        this.io.emit(topic, message.toString());
      });

      client.on("error", (err) => {
        console.error("MQTT client error:", err);
      });

      this.clients.set(machineId, client);

      return client;
    } catch (error) {
      console.error("Error connecting to MQTT:", error);
    }
  }

  async disconnect(machineId) {
    if (this.clients.has(machineId)) {
      const client = this.clients.get(machineId);
      const machine = await Machine.findById(machineId);
      if (!machine) {
        console.error(`Machine with id ${machineId} not found`);
        return;
      }

      const conditionalSubscribeTopics = machine.topics.filter(topic =>
        topic.includes("sensors/rtd1") ||
        topic.includes("sensors/rtd2") ||
        topic.includes("sensors/rtd3")
      );

      const unsubscribePromises = conditionalSubscribeTopics.map((topic) => {
        return new Promise((resolve, reject) => {
          
          this.publishTopic(client, topic, 0);

          // client.unsubscribe(topic, (err) => {
          //   if (err) {
          //     console.error(`Error unsubscribing from topic ${topic}:`, err);
          //     reject(err);
          //   } else {
          //     console.log(`Unsubscribed from conditional topic: ${topic}`);
          //     resolve();
          //   }
          // });
        });
      });

      return Promise.all(unsubscribePromises).then(() => {
        client.end();
        this.clients.delete(machineId);
        this.clearAcknowledgementTimer(machineId);
      }).catch((err) => {
        console.error("Error during unsubscribe:", err);
      });
    }
  }

  publishTopic(client, topic, status) {
    const parts = topic.split('/');
    const baseTopic = parts[0]; // e.g., "test0"
    const sensor = parts[2]; // e.g., "rtd1"

    // Check if the topic format is correct before publishing
    if (baseTopic && sensor) {
      client.publish(`${baseTopic}/sensors/SET`, `${sensor}/${status}`, (err) => {
        if (err) {
          console.error(`Error publishing to topic ${baseTopic}/sensors/SET with message ${sensor}/${status}:`, err);
        } else {
          console.log(`Published to topic ${baseTopic}/sensors/SET with message ${sensor}/${status}`);
        }
      });
    } else {
      console.error(`Invalid topic format: ${topic}`);
    }
  }


  startAcknowledgementTimer(machineId) {
    this.clearAcknowledgementTimer(machineId);
    const timer = setTimeout(() => {
      console.log(`No acknowledgement received for machineId=${machineId}, disconnecting...`);
      this.disconnect(machineId);
    }, 11 * 1000); // 5 minutes
    this.timers.set(machineId, timer);
  }

  resetAcknowledgementTimer(machineId) {
    this.clearAcknowledgementTimer(machineId);
    this.startAcknowledgementTimer(machineId);
  }

  clearAcknowledgementTimer(machineId) {
    if (this.timers.has(machineId)) {
      clearTimeout(this.timers.get(machineId));
      this.timers.delete(machineId);
    }
  }
}

// function sendNotification(token, title, body) {
//   const message = {
//     notification: {
//       title: title,
//       body: body,
//     },
//     token: token,
//   };

//   admin.messaging().send(message)
//     .then((response) => {
//       console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//       console.log('Error sending message:', error);
//     });
// }

module.exports = MQTTClientManager;
