<template>
  <v-container fluid class="fill-height pa-0">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="4" xl="3">
        <v-card class="elevation-6">
          <v-card-title class="text-h4 text-center py-2">Log In</v-card-title>
          <v-card-text>
            <v-form
              @submit.prevent="submit"
              ref="loginForm"
              v-model="isFormValid"
            >
              <!-- Email Input -->
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                dense
                required
              ></v-text-field>

              <!-- Password Input -->
              <v-text-field
                v-model="password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                :rules="[passwordRules]"
                @click:appendInner="showPassword = !showPassword"
                dense
                required
              ></v-text-field>

              <!-- Submit Button -->
              <v-btn
                color="primary"
                block
                :disabled="!isFormValid"
                type="submit"
                class="mt-4"
              >
                Submit
              </v-btn>
            </v-form>

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

            <div class="text-center mt-5">
              <p class="forgot-password-text">
                Forgot Password? No worries! Click here to generate a new one.
              </p>
              <v-btn
                text
                color="primary"
                class="mt-2 forgot-password-btn"
                to="/forgot-password"
              >
                Forgot Password
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { loginUser } from "@/services/LogInApi";
import { errorToast, successToast } from "@/utils/toast";
import validator from "validator";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      isFormValid: false,
    };
  },
  computed: {
    emailRules() {
      return [
        (v) => !!v || "Required",
        (v) => validator.isEmail(v) || "Invalid email",
      ];
    },
    passwordRules() {
      return (v) => !!v || "Password is required";
    },
  },
  mounted() {
    this.$route.query.message && successToast(this.$route.query.message);
  },
  methods: {
    ...mapActions(["login", "setUser"]),
    async submit() {
      try {
        const payload = {
          email: this.email,
          password: this.password,
          role: "Customer",
        };

        const { response, status } = await loginUser(payload);
        if (status === 200) {
          this.login();
          this.setUser(response.data.user);
          this.$router.push({ path: "/" });
        }
      } catch (error) {
        errorToast(error);
      }
    },
    async loginWithGoogle() {
      // write login logic
    },
  },
};
</script>

<style scoped>
.forgot-password-text {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 10px;
}

.forgot-password-btn {
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.forgot-password-btn:hover {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
