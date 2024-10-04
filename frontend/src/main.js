import { createApp } from "vue";
import App from "./App.vue";
import router from "../route";
import store from "../src/store/index";
// import Vue from "vue";
// import VueCookies from "vue-cookies";

// Vue.use(VueCookies);

createApp(App).use(store).use(router).mount("#app");
