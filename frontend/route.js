import TheHome from "@/components/TheHome.vue";
import { createRouter, createWebHistory } from "vue-router";
import LogIn from "@/components/LogIn.vue";
import SignIn from "@/components/SignIn.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import Cookies from "js-cookie";
import { getAccessToken } from "@/services/TokenApi";
import DashBoard from "@/components/DashBoard.vue";
import store from "@/store";

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
    {
      path: "/dashboard",
      component: DashBoard,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

// navigation guard which ensures that access token is available
router.beforeEach(async (to, from, next) => {
  const accessToken = Cookies.get("accessToken");

  if (to.meta.requiresAuth && !accessToken) {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        await getAccessToken();
        await store.dispatch("user/login");
        next();
      }
    } catch (error) {
      await store.dispatch("user/logout");
      next("/login");
    }
    await store.dispatch("user/logout");
    next("/login");
  } else {
    next();
  }
});

export default router;
