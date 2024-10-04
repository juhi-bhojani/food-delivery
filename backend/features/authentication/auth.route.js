import { Router } from "express";
import {
  refreshToken,
  userLogin,
  userLogout,
  forgetPassword,
  resetPassword,
} from "./auth.controller.js";
import auth from "../../middlewares/auth.js";

const router = Router();

router.post("/login", userLogin);
router.post("/logout", auth, userLogout);
router.post("/refresh", refreshToken);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
