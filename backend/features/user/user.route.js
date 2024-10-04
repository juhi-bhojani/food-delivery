import { Router } from "express";
import { registerUser, userProfile } from "./user.controller.js";
import auth from "../../middlewares/auth.js";

const router = Router();

router.post("/register", registerUser);
router.get("/profile", auth, userProfile);

export default router;
