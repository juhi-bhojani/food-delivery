<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="card" style="width: 30rem">
      <div class="card-body">
        <h3 class="card-title text-center">Reset Password</h3>
        <form @submit.prevent="submit">
          <!-- Password -->
          <div class="mb-3 row">
            <label for="inputPassword" class="col-sm-4 col-form-label"
              >Password</label
            >
            <div class="col-sm-8">
              <input
                type="password"
                class="form-control"
                id="inputPassword"
                v-model.trim="password"
                required
              />
              <h6 v-if="displayError" style="color: red">
                Password must be 8 characters long, one uppercase, one
                lowercase, and one special symbol.
              </h6>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-3 row">
            <label for="confirmPassword" class="col-sm-4 col-form-label"
              >Confirm Password</label
            >
            <div class="col-sm-8">
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model.trim="confirmPassword"
                required
                @input="validatePasswords()"
              />
              <h6 v-if="error.confirmPassword" style="color: red">
                Passwords do not match!
              </h6>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="displayError || password !== confirmPassword"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPassword } from "@/services/passwordApi";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      password: "",
      confirmPassword: "",
      displayError: false,
      token: this.$route.params.token,
      error: {
        confirmPassword: false,
      },
    };
  },
  watch: {
    password(newVal) {
      const hasUpperCase = /[A-Z]/.test(newVal);
      const hasLowerCase = /[a-z]/.test(newVal);
      const hasDigit = /\d/.test(newVal);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newVal);
      const isValidLength = newVal.length >= 8;

      this.displayError = !(
        isValidLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasDigit &&
        hasSpecialChar
      );
    },
  },
  methods: {
    validatePasswords() {
      this.error.confirmPassword = this.password !== this.confirmPassword;
    },
    async submit() {
      try {
        // Creating payload for request
        const payload = {
          password: this.password,
        };

        // Send request to backend for password reset
        const response = await resetPassword(payload, this.token);

        if (response.status === 200) {
          alert("Password reset successful!");
          this.$router.push({ path: "/login" });
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
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>
