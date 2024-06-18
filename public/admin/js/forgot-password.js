/* eslint-disable */
// import { axios, showAlert } from "./login";

// export
const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/forgotPassword",
      data: {
        email,
      },
    });

    if (res.data.status === "success") {
      alert("success", "Check your mail!");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    }
  } catch (err) {
    alert("error", err.response.data.message);
  }
};

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  forgotPassword(email);
});

// export
// const logout = async () => {
//   try {
//     const res = await axios({
//       method: "GET",
//       url: "/api/v1/users/logout",
//     });
//     if ((res.data.status = "success")) location.reload(true);
//   } catch (err) {
//     console.log(err.response);
//     alert("error", "Error logging out! Try again.");
//   }
// };
