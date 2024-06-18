// import axios from "axios";
// import { displayMap } from "./mapbox";
// import { login, logout } from "./login";
// import { updateSettings } from "./updateSettings";
// import { showAlert } from "./alerts";

// DOM ELEMENTS
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
// DELEGATION

const logout = async () => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/logout",
    });
    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    // console.log(err.response);
    alert("error", "Error logging out! Try again.");
  }
};

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) alert("success", alertMessage, 20);

//login js

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      alert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/dashboard");
      }, 1500);
    }
  } catch (err) {
    alert("error", err.response.data.message);
  }
};

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
