import { createApp } from "vue";
import App from "./App.vue";
import router from "../route";
import store from "../src/store/index";

store.dispatch("initializeLoginState");

createApp(App).use(store).use(router).mount("#app");
