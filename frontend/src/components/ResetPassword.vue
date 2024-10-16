<template>
  <v-container fluid class="fill-height pa-0">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="4" xl="3">
        <v-card class="elevation-6">
          <v-card-title class="text-h4 text-center py-4 border-bottom">
            Reset Password</v-card-title
          >
          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                label="Password"
                :rules="passwordRules"
                required
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:appendInner="showPassword = !showPassword"
              ></v-text-field>

              <v-text-field
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                label="Confirm Password"
                :rules="confirmPasswordRules"
                required
                :append-inner-icon="
                  showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'
                "
                @click:appendInner="showConfirmPassword = !showConfirmPassword"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                class="w-100"
                :disabled="password !== confirmPassword"
              >
                Submit
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { resetPassword } from "@/services/passwordApi";
import encryptData from "@/utils/encryptPassword";
import { errorToast, infoToast } from "@/utils/toast";

export default {
  data() {
    return {
      password: "",
      confirmPassword: "",
      showConfirmPassword: false,
      showPassword: false,
      token: this.$route.params.token,
    };
  },
  computed: {
    passwordRules() {
      return [
        (v) => !!v || "Please enter password",
        (v) => v.length >= 8 || "Password must be minimum 8 characters",
        (v) =>
          /[A-Z]/.test(v) ||
          "Password must contain atleast one uppercase character",
        (v) =>
          /[a-z]/.test(v) ||
          "Password must contain atleast one lowercase character",
        (v) => /\d/.test(v) || "Password must contain atleast one number",
        (v) =>
          /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
          "Password must contain atleast one special character",
      ];
    },
    confirmPasswordRules() {
      return [
        (v) => !!v || "Required",
        (v) => v === this.password || "Passwords don't match",
      ];
    },
  },
  methods: {
    async submit() {
      try {
        // Creating payload for request
        const payload = {
          password: encryptData(this.password),
        };

        // Send request to backend for password reset
        const response = await resetPassword(payload, this.token);

        if (response.status === 200) {
          infoToast("Password reset successful.");
          this.$router.push({ path: "/login" });
        }
      } catch (error) {
        errorToast(error);
      }
    },
  },
};
</script>

<style scoped></style>
