import axios from "axios";

axios.defaults.withCredentials = true;

export const logoutUser = async (accessToken) => {
  try {
    const response = await axios.post(
        "http://localhost:3000/api/v1/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass access token in headers
          },
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
