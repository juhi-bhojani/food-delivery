import TheHome from "@/components/TheHome.vue";
import { createRouter, createWebHistory } from "vue-router";
import LogIn from "@/components/LogIn.vue";
import SignIn from "@/components/SignUp.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import DashBoard from "@/components/DashBoard.vue";
import NotFound from "@/components/NotFound.vue";
import store from "@/store/index.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: LogIn,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/register",
      component: SignIn,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/",
      component: TheHome,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/reset-password/:token",
      component: ResetPassword,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/dashboard",
      component: DashBoard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:notFound(.*)",
      component: NotFound,
      meta: {
        requiresAuth: false,
      },
    },
  ],
});

// navigation guard to avoid hitting certain routes when authenticated
router.beforeEach(async (to, from, next) => {
  await store.dispatch("initializeLoginState");
  const isLoggedIn = store.getters["getLoginDetails"]; // Vuex getter
  if (to.meta.requiresAuth === false && isLoggedIn) {
    // If the route does not require authentication and the user is logged in,
    // redirect them to the dashboard or a default authenticated route.
    next("/dashboard");
  } else if (to.meta.requiresAuth === true && !isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
