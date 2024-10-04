import Cookies from "js-cookie";

const userModule = {
  state() {
    return {
      isLoggedIn: false,
    };
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
  actions: {
    login(context) {
      context.commit("login");
    },
    logout(context) {
      context.commit("logout");
    },
    initializeLoginState(context) {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");
      if (accessToken && refreshToken) {
        context.commit("login");
      } else {
        context.commit("logout");
      }
    },
  },
  getters: {
    getLoginDetails(state) {
      return state.isLoggedIn;
    },
  },
};

export default userModule;
