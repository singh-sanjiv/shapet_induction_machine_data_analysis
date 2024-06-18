/* eslint-disable */
// import axios from "axios";
// import { showAlert } from './alerts';

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
