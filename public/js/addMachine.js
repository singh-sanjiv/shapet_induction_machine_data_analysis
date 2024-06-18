document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed'); // Debug: DOM loaded

  const form = document.getElementById('userForm');

  form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(form);
      const data = {
          name: formData.get('name'),
          email: formData.get('inputEmail'),
          password: formData.get('inputPassword'),
          passwordConfirm: formData.get('inputPasswordConfirm'),
          phoneNumber: formData.get('inputphonenumber'),
          dateOfBirth: formData.get('dateOfBirth'),
          machines: formData.getAll('machines[]')
      };
      try {
          await axios.post('/api/v1/users/signup', data);
          showAlert('User created successfully!');
      } catch (error) {
        showAlert('Error creating user:', error);           
      }
  });
});

function addMachineId() {
  const machineIdsContainer = document.getElementById('machine-ids');
  if (!machineIdsContainer) {
      console.error('Machine IDs container not found'); // Debug: Machine IDs container not found
      return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control';
  input.name = 'machines[]';
  input.placeholder = 'Enter Machine ID';
  machineIdsContainer.appendChild(input);

  console.log('Added new machine ID input field'); // Debug: Added new machine ID input field
}


// Function to show alerts
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

