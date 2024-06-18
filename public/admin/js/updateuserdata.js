// import axios from "axios";
// import { displayMap } from "./mapbox";
// import { login, logout } from "./login";
// import { updateSettings } from "./updateSettings";
// import { showAlert } from "./alerts";

// DOM ELEMENTS
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");

// DELEGATION
if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("useremail").value);
    form.append("phoneNumber", document.getElementById("usermobile").value);
    form.append("dateOfBirth", document.getElementById("userbirthdate").value);
    // form.append("photo", document.getElementById("photo").files[0]);
    console.log(form);

    updateSettings(form, "data");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password-new").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password",
    );

    document.querySelector(".btn--save-password").textContent = "Update";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) alert("success", alertMessage, 20);

// updateSettings

// type is either 'password' or 'data'

const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
 
    if (res.data.status === "success") {
      alert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    alert("error", err.response.data.message);
  }
};
