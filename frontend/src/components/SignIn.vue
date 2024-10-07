<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="card" style="width: 30rem">
      <div class="card-body">
        <h3 class="card-title text-center">Sign In</h3>
        <form @submit.prevent="submit">
          <div class="mb-3 row">
            <label for="firstName" class="col-sm-4 col-form-label"
              >First Name</label
            >
            <div class="col-sm-8">
              <input
                type="text"
                class="form-control"
                id="firstName"
                v-model.trim="first_name"
                @blur="touched.first_name = true"
                required
              />
              <h6
                v-if="touched.first_name && !isFirstNameValid"
                class="text-danger"
              >
                Please enter first name!
              </h6>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="lastName" class="col-sm-4 col-form-label"
              >Last Name</label
            >
            <div class="col-sm-8">
              <input
                type="text"
                class="form-control"
                id="lastName"
                v-model.trim="last_name"
                required
              />
            </div>
          </div>

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
                Please enter a correct email!
              </h6>
            </div>
          </div>

          <div class="mb-3 row">
            <div class="col-sm-4">
              <select
                class="form-select"
                id="countryCode"
                v-model="country_code"
              >
                <option value="" disabled>Select Country Code</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91" selected>+91</option>
              </select>
            </div>
            <div class="col-sm-8">
              <input
                type="number"
                class="form-control"
                id="phone"
                v-model="phone_number"
                placeholder="Phone Number"
                required
              />
            </div>
          </div>

          <div class="mb-3 row">
            <label for="dob" class="col-sm-4 col-form-label"
              >Date of Birth</label
            >
            <div class="col-sm-8">
              <input
                type="date"
                class="form-control"
                id="dob"
                v-model="dob"
                @blur="touched.dob = true"
              />
              <h6 v-if="touched.dob && !isDobValid" class="text-danger">
                You must be 13 years of age to open an account!
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
                @blur="touched.password = true"
                required
              />
              <h6 v-if="touched.password && displayError" class="text-danger">
                Password must be 8 characters long, one uppercase, one
                lowercase, and one special symbol.
              </h6>
            </div>
          </div>

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
                @blur="touched.confirmPassword = true"
                required
              />
              <h6
                v-if="touched.confirmPassword && !validatePassword"
                class="text-danger"
              >
                Passwords do not match!
              </h6>
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
      </div>
    </div>
  </div>
</template>

<script>
import validator from "validator";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { registerUser } from "@/services/SignUpApi";

export default {
  data() {
    return {
      password: "",
      displayError: false,
      first_name: "",
      last_name: "",
      phone_number: "",
      country_code: "",
      dob: "",
      email: "",
      confirmPassword: "",
      touched: {
        first_name: false,
        email: false,
        dob: false,
        password: false,
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
  computed: {
    isEmailValid() {
      return validator.isEmail(this.email);
    },
    isFirstNameValid() {
      return this.first_name !== "";
    },
    isDobValid() {
      if (!this.dob) return true; // Return true if DOB is not provided

      const dob = new Date(this.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      // Check if the current date has passed the birthday this year
      const hasBirthdayPassed =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
          today.getDate() >= dob.getDate());

      return age > 13 || (age === 13 && hasBirthdayPassed);
    },

    validatePassword() {
      return this.password === this.confirmPassword;
    },
    isFormValid() {
      return (
        this.isEmailValid &&
        this.isFirstNameValid &&
        !this.displayError && // password validation
        this.validatePassword &&
        this.isDobValid &&
        this.phone_number // check if not empty
      );
    },
  },
  methods: {
    async submit() {
      try {
        const payload = {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          country_code: this.country_code,
          phone_number: this.phone_number.toString(),
          dob: this.dob,
          password: this.password,
          role: "Customer",
        };

        const response = await registerUser(payload);

        if (response.status === 200) {
          this.$router.push({
            path: "/login",
            query: {
              message:
                response.data.message ||
                "Registration successful! Please log in.",
            },
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
</style>
