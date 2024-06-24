document.addEventListener("DOMContentLoaded", function() {
  const machineList = document.getElementById("machineList");
  if (machineList) {
    userData.machines.forEach((machine, index) => {
      const listItem = document.createElement("li");
      listItem.className = "media dropdown-item";
      listItem.dataset.index = index; 

      // Create the image element
      const img = document.createElement("img");
      img.src = "https://www.shapet.com/shapetgallery/productimages/324.jpg"; // You can customize this URL based on machine data if available
      img.alt = "machine";
      img.style.width = "40px";
      img.style.margin = "2px";

      // Create the media body container
      const mediaBody = document.createElement("div");
      mediaBody.className = "media-body";

      // Create the title element
      const h5 = document.createElement("h5");
      h5.className = "action-title";
      h5.textContent = machine.machineName;

      // Create the description paragraph
      const p = document.createElement("p");

      // Create the timing span
      const span = document.createElement("span");
      span.className = "timing";
      span.textContent = "2 Kg to 5 Kg"; // Customize this text based on machine data if available

      p.appendChild(span);
      mediaBody.appendChild(h5);
      mediaBody.appendChild(p);
      listItem.appendChild(img);
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
