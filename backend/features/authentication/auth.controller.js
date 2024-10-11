import decryptData from "../../utils/decryptPassword.js";
import { asyncErrorHandler } from "../../utils/globalErrorHandler.js";
import {
  loginUser,
  deleteToken,
  sendPasswordResetEmail,
  passwordReset,
} from "./auth.service.js";

export const userLogin = asyncErrorHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const { userDetails, accessToken, refreshToken } = await loginUser(
    {
      email,
      password,
    },
    role
  );

  // Set cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_COOKIE),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY_COOKIE),
  });

  return res.status(200).json({
    status: "Success",
    message: "User Logged in successfully",
    data: {
      user: {
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email: userDetails.email,
      },
    },
  });
});

export const userLogout = asyncErrorHandler(async (req, res) => {
  await deleteToken(req.user.uuid, req.role);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res
    .status(200)
    .json({ status: "Success", message: "Logged out successfully" });
});

export const forgetPassword = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;
  await sendPasswordResetEmail(email);
  return res
    .status(200)
    .json({ status: "Success", message: "Password reset email sent" });
});

export const resetPassword = asyncErrorHandler(async (req, res) => {
  const { token } = req.params;
  const newPassword = decryptData(req.body.password);
  await passwordReset(token, newPassword);
  return res
    .status(200)
    .json({ status: "Success", message: "Password reset successful" });
});
