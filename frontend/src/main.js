import { createApp } from "vue";
import App from "./App.vue";
import router from "../route";
import store from "../src/store/index";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VDateInput } from "vuetify/labs/VDateInput";

const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  iconfont: "mdi",
});

store.dispatch("initializeLoginState");

createApp(App).use(vuetify).use(store).use(router).mount("#app");
