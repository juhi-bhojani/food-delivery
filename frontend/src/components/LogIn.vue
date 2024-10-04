<template>
  <div class="d-flex justify-content-center align-items-center flex-column">
    <div v-if="message" class="success-message mb-3">{{ message }}</div>
    <div class="card" style="width: 30rem">
      <div class="card-body">
        <h5 class="card-title text-center">Login</h5>
        <form @submit.prevent="submit">
          <div class="mb-3 row">
            <label for="email" class="col-sm-4 col-form-label">Email</label>
            <div class="col-sm-8">
              <input
                type="email"
                class="form-control"
                id="email"
                v-model.trim="email"
                @blur="touched.email = true"
                required
              />
              <h6 v-if="touched.email && !isEmailValid" class="text-danger">
                Please enter a valid email address!
              </h6>
            </div>
          </div>

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
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="!isFormValid"
          >
            Submit
          </button>
        </form>

        <div class="mt-3 text-center">
          <p class="small text-muted">
            Forgot your password? No worries! Click below to reset it.
          </p>
          <router-link to="/forgot-password" class="text-primary"
            >Forgot Password</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "@/services/LogInApi";
import validator from "validator";
import { mapActions } from "vuex";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      email: "",
      password: "",
      touched: {
        email: false,
      },
    };
  },
  computed: {
    isEmailValid() {
      return validator.isEmail(this.email);
    },
    isFormValid() {
      return this.isEmailValid && this.password;
    },
    message() {
      return this.$route.query.message;
    },
  },
  methods: {
    ...mapActions(["login"]),
    async submit() {
      if (!this.isEmailValid) {
        this.touched.email = true;
        return;
      }

      try {
        const payload = {
          email: this.email,
          password: this.password,
          role: "Customer",
        };

        const response = await loginUser(payload);
        if (response.status === 200) {
          this.login();
          this.$router.push({
            path: "/",
          });
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
.text-danger {
  color: red;
}
.success-message {
  color: green;
  font-size: 1.2rem;
}
</style>
