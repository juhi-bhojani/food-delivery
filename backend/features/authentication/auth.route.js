import { Router } from "express";
import session from "express-session";
import {
  refreshToken,
  userLogin,
  userLogout,
  forgetPassword,
  resetPassword,
} from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import passport from "passport";
import "./passport.js";

const router = Router();

// Set up session management
router.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.post("/login", userLogin);
router.post("/logout", auth, userLogout);
router.post("/refresh", refreshToken);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    
    // Successful authentication, redirect or handle the user as desired
    res.redirect("/");
  }
);

export default router;
