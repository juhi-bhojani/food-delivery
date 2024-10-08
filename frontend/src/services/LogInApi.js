import axios from "axios";

axios.defaults.withCredentials = true;

export const loginUser = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/login",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
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
