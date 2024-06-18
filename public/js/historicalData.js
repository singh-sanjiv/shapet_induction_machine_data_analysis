document.addEventListener('DOMContentLoaded', function() {
  var machineId = "665d70001db56a4a7023c18a"; // Predefined ID for testing
  var apiUrl = '/api/v1/machineData'

  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          console.log(data); // Log the full response for debugging

          if (data.status === 'success' && data.data && data.data.data) {
              populateTable(data.data.data);
          } else {
              console.error('Unexpected response structure:', data);
          }
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });

  function populateTable(data) {
      const tableBody = document.querySelector('#data-table tbody');
      tableBody.innerHTML = ''; // Clear existing data

      data.forEach((item, index) => {
          const row = document.createElement('tr');

          const cellIndex = document.createElement('td');
          cellIndex.textContent = index + 1;
          row.appendChild(cellIndex);

          const cellMachineID = document.createElement('td');
          cellMachineID.textContent = item.machineID || '';
          row.appendChild(cellMachineID);

          const cellSensorType = document.createElement('td');
          cellSensorType.textContent = item.sensorType || '';
          row.appendChild(cellSensorType);

          const cellTopic = document.createElement('td');
          cellTopic.textContent = item.topic || '';
          row.appendChild(cellTopic);

          const cellMessage = document.createElement('td');
          cellMessage.textContent = item.message || item.value || '';
          row.appendChild(cellMessage);

          const cellTimeStamp = document.createElement('td');
          cellTimeStamp.textContent = new Date(item.timeStamp).toLocaleString();
          row.appendChild(cellTimeStamp);

          tableBody.appendChild(row);
      });
  }
});