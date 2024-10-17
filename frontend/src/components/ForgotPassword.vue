<template>
  <v-container fluid class="fill-height pa-0">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="4" xl="3">
        <v-card class="elevation-6">
          <v-card-title class="text-h4 text-center"
            >Forgot Password</v-card-title
          >
          <v-card-text>
            <v-form @submit.prevent="submit" ref="form" v-model="isFormValid">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                dense
                required
              ></v-text-field>

              <v-btn
                color="primary"
                block
                :disabled="error.email || isLoading"
                type="submit"
                class="mt-3"
              >
                <span v-if="isLoading">Loading...</span>
                <span v-else>Submit</span>
              </v-btn>
            </v-form>

            <div class="text-center mt-3">
              <p class="text-caption text-muted">
                Enter your email to receive password reset instructions.
              </p>
              <router-link
                to="/login"
                style="color: inherit; text-decoration: none"
              >
                <span class="text-primary" style="color: inherit"
                  >Back to Login</span
                >
              </router-link>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import validator from "validator";
import { forgotPassword } from "@/services/passwordApi";
import { infoToast, errorToast } from "@/utils/toast";

export default {
  data() {
    return {
      email: "",
      error: {
        email: false,
      },
      isLoading: false, // Loading state
    };
  },
  computed: {
    emailRules() {
      return [
        (v) => !!v || "Required",
        (v) => validator.isEmail(v) || "Invalid email",
      ];
    },
  },
  methods: {
    async submit() {
      this.isLoading = true; // Start loading
      try {
        const payload = {
          email: this.email,
        };
        const { status } = await forgotPassword(payload);

        status === 200 &&
          infoToast(
            "Password reset instructions have been sent to your email."
          );
      } catch (error) {
        errorToast(error);
      } finally {
        this.isLoading = false; // Stop loading
      }
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>
