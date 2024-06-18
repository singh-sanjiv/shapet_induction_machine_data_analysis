document.addEventListener("DOMContentLoaded", function() {
  let chartType = document.getElementById("graphType").value;
  let liveChartCtx = document.getElementById("liveChart").getContext('2d');

  // Predefined colors for sensors
  const sensorColors = {
    rtd1: '#121212', 
    rtd2: '#0442BA',
    rtd3: '#FFCE56'
  };

  function getColor(sensorName) {
    return sensorColors[sensorName] || getRandomColor();
  }

  // Function to generate random color
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  let liveChart = new Chart(liveChartCtx, {
    type: chartType,
    data: {
      labels: [],
      datasets: []
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'second',
            displayFormats: {
              second: 'mm:ss'
            }
          },
          ticks: {
            maxTicksLimit: 20 // Limit the number of ticks to 20
          }
        }
      }
    }
  });

  const socket = io();

  const machineId = userData.machines[userData.selectMachine]._id; 
  socket.emit("userConnected", { connected: true, machineId });
  window.addEventListener("beforeunload", (event) => {
    socket.emit("userDisconnected", { connected: false, machineId });
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  let selectMachineValue = userData.selectMachine;

  if (selectMachineValue >= 0 && selectMachineValue < userData.machines.length) {
    let topics = userData.machines[selectMachineValue].topics;

    topics.forEach((topic) => {
      socket.on(topic, (data) => {
        console.log(`Received data for topic ${topic}:`, data);
        const sensorName = topic.split('/').pop();
        const sensorElement = document.getElementById(sensorName);

        if (sensorElement) {
          sensorElement.innerText = data;
        } else {
          console.warn(`Element with id ${sensorName} not found`);
        }

        let dataset = liveChart.data.datasets.find(dataset => dataset.label === sensorName);

        if (!dataset) {
          const color = getColor(sensorName);
          dataset = {
            label: sensorName,
            data: [],
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            fill: false
          };
          liveChart.data.datasets.push(dataset);
        }

        // Get the current time in mm:ss format
        const now = ((date) => `${date.getMinutes().toString().padStart(2, '0')} : ${date.getSeconds().toString().padStart(2, '0')}`)(new Date());


        // Ensure consistent timestamp for labels and data points
        liveChart.data.labels.push(now);

        dataset.data.push({
          x: now,
          y: data
        });

        // // Maintain a maximum of 20 data points
        if (liveChart.data.labels.length > 20) {
          liveChart.data.labels.shift();
          // liveChart.data.datasets.forEach(dataset => {
            dataset.data.shift();
          // });
        }

        liveChart.update();
      });
    });

    // Set up the acknowledgment interval
    setInterval(() => {
      socket.emit("acknowledge", { machineId });
    }, 10 * 1000); // 1 minute interval
  } else {
    console.error('Invalid selectMachineValue:', selectMachineValue);
  }

  document.getElementById("graphType").addEventListener("change", function() {
    chartType = this.value; // Update the chart type
    console.log(chartType);
    liveChart.destroy(); // Destroy the existing chart
    liveChart = new Chart(liveChartCtx, {
      type: chartType,
      data: {
        labels: liveChart.data.labels, // Retain existing data
        datasets: liveChart.data.datasets // Retain existing datasets
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second',
              displayFormats: {
                second: 'mm:ss'
              }
            },
            ticks: {
              maxTicksLimit: 20 // Limit the number of ticks to 20
            }
          }
        }
      }
    });
  });
});
