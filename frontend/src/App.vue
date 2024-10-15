<template>
  <v-app>
    <the-header></the-header>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import { mapActions } from "vuex";
export default {
  components: { TheHeader },
  name: "App",
  created() {
    this.initializeLoginState();
  },
  methods: {
    ...mapActions(["initializeLoginState"]),
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
