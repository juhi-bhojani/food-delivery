<template>
  <div>
    <h4 v-if="user">{{ fullName }}</h4>
    <h1 v-else>Welcome User!</h1>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    this.checkCookiesAndFetchUserDetails();
  },
  computed: {
    fullName() {
      return this.user
        ? `Hello ${this.user.first_name} ${this.user.last_name}`
        : "";
    },
  },
  methods: {
    ...mapActions(["login"]),
    async checkCookiesAndFetchUserDetails() {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (accessToken && refreshToken) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/v1/profile",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`, // Pass access token in headers
              },
            }
          );

          if (response.status === 200) {
            this.login();
            this.user = response.data.data.user; // Set user data to the component's state
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    },
  },
};
</script>
