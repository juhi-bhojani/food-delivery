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
            <router-link class="nav-link" to="/" @click="logoutUser"
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
import Cookies from "js-cookie";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  computed: {
    ...mapGetters({
      isLoggedIn: "getLoginDetails",
    }),
  },
  methods: {
    ...mapActions(["logout"]),
    async logoutUser() {
      try {
        const accessToken = Cookies.get("accessToken");

        if (accessToken) {
          const response = await logoutUser(accessToken);
          if (response.status === 200) {
            this.logout();
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");

            // Redirect user with a success message
            this.$router.push({
              path: "/login",
            });
          }
        } else {
          this.logout();
          throw new Error("Some Error occured!");
        }
      } catch (error) {
        toast(error, {
          theme: "auto",
          type: "error",
          position: "bottom-center",
          dangerouslyHTMLString: true,
        });
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
