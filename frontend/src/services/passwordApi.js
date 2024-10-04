import axios from "axios";

axios.defaults.withCredentials = true;

export const forgotPassword = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/forget-password",
      payload
    );
    return response;
  } catch (error) {
    throw new Error(
      error?.response.data?.message ||
        error?.response.data?.error ||
        "An error occurred. Please try again."
    );
  }
};

export const resetPassword = async (payload,token) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/v1/reset-password/${token}`,
      payload
    );

    return response;
  } catch (error) {
    throw new Error(
      error?.response.data?.message ||
        error?.response.data?.error ||
        "An error occurred. Please try again."
    );
  }
};
