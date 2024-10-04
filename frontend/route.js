import TheHome from "@/components/TheHome.vue";
import { createRouter, createWebHistory } from "vue-router";
import LogIn from "@/components/LogIn.vue";
import SignIn from "@/components/SignIn.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import ResetPassword from "@/components/ResetPassword.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: LogIn,
    },
    {
      path: "/register",
      component: SignIn,
    },
    {
      path: "/",
      component: TheHome,
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
    },
    {
      path: "/reset-password/:token",
      component: ResetPassword,
    },
  ],
});

export default router;
