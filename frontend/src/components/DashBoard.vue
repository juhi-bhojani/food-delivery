<template>
  <h1 v-if="user">Welcome to dashboard {{ user.first_name }}</h1>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      user: "getUserDetails",
    }),
  },
};
</script>
