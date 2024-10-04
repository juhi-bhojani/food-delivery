<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="card" style="width: 30rem">
      <div class="card-body">
        <h5 class="card-title text-center">Forgot Password</h5>

        <!-- Form for entering email -->
        <form @submit.prevent="submit">
          <div class="mb-3 row">
            <label for="email" class="col-sm-4 col-form-label">Email</label>
            <div class="col-sm-8">
              <input
                type="email"
                class="form-control"
                id="email"
                v-model.trim="email"
                required
                @input="validateEmail()"
              />
              <h6 v-if="error.email" style="color: red">
                Please enter a valid email!
              </h6>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="error.email || isLoading"
          >
            <span v-if="isLoading">Loading...</span>
            <!-- Loading text -->
            <span v-else>Submit</span>
          </button>
        </form>

        <div class="mt-3 text-center">
          <p class="small text-muted">
            Enter your email to receive password reset instructions.
          </p>
          <router-link to="/login" class="text-primary">
            Back to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import validator from "validator";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { forgotPassword } from "@/services/passwordApi";

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
  methods: {
    validateEmail() {
      this.error.email = !validator.isEmail(this.email);
    },
    async submit() {
      this.isLoading = true; // Start loading
      try {
        const payload = {
          email: this.email,
        };
        const response = await forgotPassword(payload);

        if (response.status === 200) {
          toast("Password reset instructions have been sent to your email.", {
            theme: "auto",
            type: "info",
            position: "bottom-center",
            dangerouslyHTMLString: true,
          });
          this.email = ""; // Clear email input
        }
      } catch (error) {
        toast(error, {
          theme: "auto",
          type: "error",
          position: "bottom-center",
          dangerouslyHTMLString: true,
        });
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
