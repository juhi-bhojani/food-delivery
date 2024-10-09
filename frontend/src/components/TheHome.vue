<template>
  <div>
    <h4 v-if="user">{{ fullName }}</h4>
    <h1 v-else>Welcome User!</h1>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  mounted() {
    this.checkCookiesAndFetchUserDetails();
  },
  computed: {
    ...mapGetters({
      user: "getUserDetails",
    }),
    fullName() {
      return this.user
        ? `Hello ${this.user.first_name} ${this.user.last_name}`
        : "";
    },
  },
  methods: {
    ...mapActions(["login", "initializeLoginState"]),
    async checkCookiesAndFetchUserDetails() {
      await this.initializeLoginState();
    },
  },
};
</script>
