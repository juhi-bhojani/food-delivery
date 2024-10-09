import { backendUrl } from "@/config";
import axios from "axios";

const userModule = {
  state() {
    return {
      isLoggedIn: false,
      user: {},
    };
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    user(state, userDetails) {
      state.user = userDetails;
    },
  },
  actions: {
    login(context) {
      context.commit("login");
    },
    logout(context) {
      context.commit("logout");
    },
    user(context, payload) {
      context.commit("user", payload);
    },
    async initializeLoginState(context) {
      try {
        const response = await axios.get(`${backendUrl}/profile`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          context.commit("login");
          // this.user = response.data.data.user; // Set user data to the component's state
          console.log(response.data.data.user);

          context.commit("user", response?.data?.data?.user);
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
