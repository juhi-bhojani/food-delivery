<template>
  <v-container fluid class="fill-height pa-0">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="4" xl="3">
        <v-card class="elevation-6">
          <v-card-title class="text-h4 text-center py-4 border-bottom">
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
                :rules="SignphoneRules"
                label="Phone Number"
                type="number"
                dense
                required
              ></v-text-field>

              <!-- <v-menu v-model="showDatePicker" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <div class="d-flex justify-space-around align-center">
                    <v-icon
                      color="#112D4E
"
                      class="mb-7 mr-4 ml-4 ml-md-0"
                      icon="calendar_month"
                    ></v-icon>
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      :rules="[required]"
                      @click="showDatePicker = !showDatePicker"
                      v-model="dob"
                      label="Birth Date"
                      readonly
                      v-bind="props"
                    ></v-text-field>
                  </div>
                </template>
                <v-date-picker
                  v-model="dob"
                  date-format="MMM d, yyyy"
                  :max="new Date(Date.now())"
                  @input="showDatePicker = false"
                ></v-date-picker>
              </v-menu> -->

              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                :rules="passwordRules"
                @click:append="showPassword = !showPassword"
                dense
                required
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirm Password"
                :rules="confirmPasswordRules"
                @click:append="showConfirmPassword = !showConfirmPassword"
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

            <p class="text-caption mt-3">
              Already have an account?
              <router-link
                to="/login"
                class="text-primary font-weight-bold no-underline"
              >
                Log In
              </router-link>
            </p>
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
      dob: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      menu: false,
      birthDate: "",
    };
  },
  computed: {
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
          const dob = new Date(v); // Convert input to Date object
          if (isNaN(dob)) return "Invalid date"; // Handle invalid date input

          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();

          const birthdayThisYear = new Date(
            today.getFullYear(),
            dob.getMonth(),
            dob.getDate()
          );

          const hasBirthdayPassed = today >= birthdayThisYear;

          return (
            age > 13 ||
            (age === 13 && hasBirthdayPassed) ||
            "Must be 13+ years old"
          );
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
          errorToast(error);
        }
      }
    },
  },
};
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
</style>
