import { backendUrl } from "@/config";
import axios from "axios";

axios.defaults.withCredentials = true;

export const logoutUser = async () => {
  try {
    const { data, status } = await axios.post(`${backendUrl}/logout`);

    return { response: data, status };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "An error occurred. Please try again."
    );
  }
};
