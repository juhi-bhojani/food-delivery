import logger from "../../utils/logger.js";
import {
  loginUser,
  deleteToken,
  getRefreshToken,
  sendPasswordResetEmail,
  passwordReset,
} from "./auth.service.js";

export const userLogin = async (req, res) => {
  try {
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
      // httpOnly: false,
      // secure: false,
      // sameSite: "none", // prevents CSRF attacks - if strict
      maxAge: 60 * 60 * 1000, // 60 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      // httpOnly: false,
      // secure: false,
      // sameSite: "none", // prevents CSRF attacks - if strict
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
  } catch (error) {
    logger.error({
      incoming_request: req.url,
      method: req.method,
      error: error.message || "Error occured at auth controller to login user",
    });

    res.status(400).json({
      status: "Failure",
      message: error.message || "Sorry, Internal server error!",
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    const token = await deleteToken(req.user.uuid, req.role);
    res.clearCookie("accessToken", { httpOnly: false, sameSite: "none" }); // name of cookie
    res.clearCookie("refreshToken");
    res
      .status(200)
      .json({ status: "Success", message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Sorry, unable to logout user",
    });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  try {
    const accessToken = await getRefreshToken(refreshToken);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      // httpOnly: true,
      // sameSite: "Strict", // prevents CSRF attacks
      maxAge: 60 * 60 * 1000, // 60 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      // httpOnly: true,
      // sameSite: "Strict", // prevents CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({});
  } catch (e) {
    res.status(400).json({
      status: "Failure",
      message: "Sorry, unable to authencticate user",
    });
    logger.error(
      `Error occurred: ${e} at ${req.url} and method: ${req.method}`
    );
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(email);
    return res
      .status(200)
      .json({ status: "Success", message: "Password reset email sent" });
  } catch (error) {
    return res.status(500).json({
      status: "Failure",
      error: error.message || "Sorry, unable to reset password at the moment!",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const newPassword = req.body.password;
  try {
    await passwordReset(token, newPassword);
    return res
      .status(200)
      .json({ status: "Success", message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ status: "Failure", error: error.message });
  }
};
