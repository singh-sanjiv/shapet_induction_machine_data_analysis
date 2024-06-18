document.addEventListener("DOMContentLoaded", function() {
  const machineList = document.getElementById("machineList");
  if (machineList) {
    userData.machines.forEach((machine, index) => {
      const listItem = document.createElement("li");
      listItem.className = "media dropdown-item";
      listItem.dataset.index = index; 
      const mediaBody = document.createElement("div");
      mediaBody.className = "media-body";

      const h5 = document.createElement("h5");
      h5.className = "action-title";
      h5.textContent = machine.machineName;

      mediaBody.appendChild(h5);
      listItem.appendChild(mediaBody);
      machineList.appendChild(listItem);

      if (index === userData.selectMachine) {
        listItem.classList.add("selected");
      }

      listItem.addEventListener("click", async () => {
        const allItems = document.querySelectorAll("#machineList .dropdown-item");
        allItems.forEach(item => item.classList.remove("selected"));

        listItem.classList.add("selected");

        try {
          const response = await axios.patch('/api/v1/users/updateMe', {
            selectMachine: index
          });
          console.log('Machine updated:', response.data);
          
          location.reload();
        } catch (error) {
          console.error('Error updating machine:', error.response ? error.response.data : error.message);
        }
      });
    });
  } else {
    console.error("Machine list container not found!");
  }
});
