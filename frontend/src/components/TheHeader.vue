<template>
  <div>
    <v-toolbar :elevation="5">
      <router-link to="/" class="toolbar-link">
        <v-toolbar-title class="title">MealMates</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <template v-if="!isLoggedIn">
        <!-- classes here ensure that it is visible on medium or higher screens -->
        <v-btn to="/login" class="d-none d-md-flex" variant="text">Login</v-btn>
        <v-btn to="/register" class="d-none d-md-flex" variant="text"
          >Sign-Up</v-btn
        >
      </template>

      <!-- Hamburger menu for mobile view -->
      <v-menu v-if="!isLoggedIn">
        <template v-slot:activator="{ props }">
          <v-btn icon class="d-md-none" v-bind="props">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/login"> Login </v-list-item>
          <v-list-item to="/register"> Sign-Up </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        icon
        to="/login"
        v-if="isLoggedIn"
        @click="logOutUser"
        elevation="0"
        variant="plain"
      >
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { logoutUser } from "@/services/LogoutApi";
import { errorToast } from "@/utils/toast";

export default {
  computed: {
    ...mapGetters({
      isLoggedIn: "getLoginDetails",
      user: "getUserDetails",
    }),
  },
  methods: {
    ...mapActions(["logout", "clearUser"]),
    async logOutUser() {
      try {
        const response = await logoutUser();
        if (response.status === 200) {
          this.logout();
          this.clearUser();
          console.log("Hi");
          console.log(this.$router);

          // Redirect user with a success message
          // this.$router.replace({
          //   path: "/login",
          //   query: {
          //     message: "Logout Successful!",
          //   },
          // });
          this.$router.replace("/login");
        }
      } catch (error) {
        errorToast(error);
      }
    },
  },
};
</script>

<style scoped>
.toolbar-link {
  text-decoration: none;
  color: inherit;
  display: block;
  left: 3%;
  position: relative;
  font-weight: normal;
}

.toolbar-link:hover {
  font-weight: 900;
}

.title {
  font-weight: 100;
}
</style>
