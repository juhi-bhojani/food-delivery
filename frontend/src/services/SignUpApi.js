import axios from "axios";

axios.defaults.withCredentials = true;

export const registerUser = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/register",
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
