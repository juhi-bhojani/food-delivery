import { Router } from "express";
import {
  userLogin,
  userLogout,
  forgetPassword,
  resetPassword,
} from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import passport from "passport";
import "./passport.js";

const router = Router();

router.use(passport.initialize());

router.post("/login", userLogin);
router.post("/logout", auth, userLogout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
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
