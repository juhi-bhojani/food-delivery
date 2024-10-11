import { backendUrl } from "@/config";
import axios from "axios";

const userModule = {
  state() {
    return {
      isLoggedIn: false,
      user: null,
    };
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    set_user(state, userDetails) {
      state.user = userDetails;
    },
    clear_user(state) {
      state.user = null;
    },
  },
  actions: {
    login(context) {
      context.commit("login");
    },
    logout(context) {
      context.commit("clear_user");
      context.commit("logout");
    },
    async initializeLoginState(context) {
      try {
        const response = await axios.get(`${backendUrl}/profile`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          context.commit("set_user", response?.data?.data?.user);
          context.commit("login");
        }
      } catch (error) {
        context.commit("logout");
      }
    },
  },
  getters: {
    getLoginDetails(state) {
      return state.isLoggedIn;
    },
    getUserDetails(state) {
      return state.user;
    },
  },
};

export default userModule;
