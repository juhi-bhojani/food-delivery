<template>
  <v-container fluid class="fill-height pa-0">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="4" xl="3">
        <v-card class="elevation-6">
          <v-card-title class="text-h5 text-center py-4 border-bottom">
            Sign Up</v-card-title
          >
          <v-card-text>
            <v-form
              ref="form"
              v-model="isFormValid"
              @submit.prevent="submit"
              class="px-2"
            >
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="first_name"
                    :rules="firstNameRules"
                    label="First Name"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="last_name"
                    label="Last Name"
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                dense
                required
              ></v-text-field>

              <v-text-field
                v-model="phone_number"
                :rules="phoneRules"
                label="Phone Number"
                type="number"
                dense
                required
              ></v-text-field>

              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset="0"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="formattedDate"
                    label="Date of Birth"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    :rules="dobRules"
                    clearable
                    @click:clear="clearDate"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dob"
                  @update:model-value="selectDate"
                ></v-date-picker>
              </v-menu>

              <v-text-field
                v-model="password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                :rules="passwordRules"
                @click:appendInner="showPassword = !showPassword"
                dense
                required
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :append-inner-icon="
                  showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'
                "
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirm Password"
                :rules="confirmPasswordRules"
                @click:appendInner="showConfirmPassword = !showConfirmPassword"
                dense
                required
              ></v-text-field>

              <v-btn
                color="primary"
                class="mt-2"
                block
                :disabled="!isFormValid"
                type="submit"
                small
              >
                Submit
              </v-btn>
            </v-form>

            <!-- <p class="text-caption mt-3">
              Already have an account?
              <router-link
                to="/login"
                class="text-primary font-weight-bold no-underline"
              >
                Log In
              </router-link>
            </p> -->

            <div class="text-center my-4">
              <span><b>OR</b></span>
            </div>

            <!-- Google Login Button -->
            <div class="text-center">
              <v-btn
                class="google-login-btn mt-2"
                color="white"
                elevation="2"
                @click="loginWithGoogle"
                block
              >
                <v-icon left class="mr-2">mdi-google</v-icon>
                Login with Google
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { registerUser } from "@/services/SignUpApi";
import { errorToast } from "@/utils/toast";
import { countryCode } from "@/config";
import validator from "validator";

export default {
  data() {
    return {
      isFormValid: false,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      dob: null,
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      menu: false,
      maxDate: new Date().toISOString().substr(0, 10),
    };
  },
  computed: {
    formattedDate() {
      if (!this.dob) return "";
      let date;

      if (typeof this.dob === "string") {
        // If dob is already a string, try to create a Date object
        date = new Date(this.dob);
      } else if (this.dob instanceof Date) {
        // If dob is already a Date object, use it directly
        date = this.dob;
      } else {
        // If dob is neither a string nor a Date, return an empty string
        return "";
      } // Format the date
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    },
    firstNameRules() {
      return [(v) => !!v || "Required"];
    },
    emailRules() {
      return [
        (v) => !!v || "Required",
        (v) => validator.isEmail(v) || "Invalid email",
      ];
    },
    phoneRules() {
      return [
        (v) => !!v || "Required",
        (v) => v.toString().length === 10 || "Must be 10 digits",
      ];
    },
    dobRules() {
      return [
        (v) => !!v || "Required",
        (v) => {
          const birthDate = new Date(v);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          return age >= 13 || "You must be at least 13 years old";
        },
      ];
    },
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
    selectDate(date) {
      this.dob = date;
      this.menu = false; // Close the menu
    },
    clearDate() {
      this.dob = null;
      this.menu = false;
    },
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          const payload = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            country_code: countryCode,
            phone_number: this.phone_number.toString(),
            dob: this.dob,
            password: this.password,
            role: "Customer",
          };

          const { response, status } = await registerUser(payload);

          if (status === 200) {
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
          errorToast(error);
        }
      }
    },
    async loginWithGoogle() {
      // write login logic
    },
  },
};
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
</style>
