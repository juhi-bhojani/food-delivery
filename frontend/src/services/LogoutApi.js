import axios from "axios";

axios.defaults.withCredentials = true;

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      "http://192.1.200.190:3000/api/v1/logout"
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
