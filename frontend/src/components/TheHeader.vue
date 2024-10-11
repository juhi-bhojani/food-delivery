<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">Foodie</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link active" aria-current="page" to="/"
                >Home</router-link
              >
            </li>
          </ul>
          <span class="navbar-text me-3" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login">Login</router-link>
          </span>
          <span class="navbar-text" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/register">Sign-up</router-link>
          </span>
          <span class="navbar-text" v-if="isLoggedIn">
            <router-link class="nav-link" to="/" @click="logOutUser"
              >Logout</router-link
            >
          </span>
        </div>
      </div>
    </nav>
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
    }),
  },
  methods: {
    ...mapActions(["logout"]),
    async logOutUser() {
      try {
        const response = await logoutUser();
        if (response.status === 200) {
          this.logout();

          // Redirect user with a success message
          this.$router.push({
            path: "/login",
          });
        }
      } catch (error) {
        errorToast(error);
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  top: -59px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
