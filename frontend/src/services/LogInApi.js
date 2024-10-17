import { backendUrl } from "@/config";
import encryptData from "@/utils/encryptPassword";
import axios from "axios";

axios.defaults.withCredentials = true;

export const loginUser = async (payload) => {
  try {
    payload.password = encryptData(payload.password);
    const { data, status } = await axios.post(`${backendUrl}/login`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return { response: data, status };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "An error occurred. Please try again."
    );
  }
};
