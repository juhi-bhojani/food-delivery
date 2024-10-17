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
    setUser(state, userDetails) {
      state.user = userDetails;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  actions: {
    login(context) {
      context.commit("login");
    },
    logout(context) {
      context.commit("logout");
    },
    clearUser(context) {
      context.commit("clearUser");
    },
    setUser(context, payload) {
      context.commit("setUser", payload);
    },
    async initializeLoginState(context) {
      try {
        const { data, status } = await axios.get(`${backendUrl}/profile`, {
          withCredentials: true,
        });

        if (status === 200) {
          context.commit("setUser", data?.data?.user);
          context.commit("login");
        }
      } catch (error) {
        context.commit("clearUser");
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
