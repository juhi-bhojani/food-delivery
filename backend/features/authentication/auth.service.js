import {
  deleteRefreshToken,
  findUser,
  storeRefreshToken,
  selectRefreshToken,
  savePasswordResetToken,
  findUserByResetToken,
  clearResetToken,
  updateUserPassword,
} from "./auth.repository.js";
import { getUserRoles } from "../user_role/user_role.repository.js";
import { getRoleId } from "../role/role.repository.js";
import { sendResetEmail } from "../../utils/emailSender.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import decryptData from "../../utils/decryptPassword.js";
import CustomError from "../../utils/customError.js";
import validatePassword from "../../utils/validatePassword.js";

export const loginUser = async (user, roleType) => {
  // decrypt password
  user.password = decryptData(user.password);

  const userDetails = await findUser(user);

  if (!userDetails) {
    throw new CustomError("User doesn't exist, Please Register!", 404);
  }
  if (!(await userDetails.validatePassword(user.password))) {
    throw new CustomError("Incorrect email or password", 401);
  }

  const userRole = await getUserRoles(userDetails.uuid);

  // get role id based on role and then compare if user has given role
  const role = await getRoleId(roleType);

  if (!userRole.includes(role.uuid)) {
    throw new CustomError("User doesn't exist, Please register!", 404);
  }

  const { accessToken, refreshToken } = await userDetails.generateAuthToken(
    role.uuid
  );
  // setting expiry date of refresh token
  const expiresAt = new Date(
    Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY_COOKIE)
  );

  // storing refresh token in db
  await storeRefreshToken({
    token: refreshToken,
    user_uuid: userDetails.uuid,
    role_uuid: role.uuid,
    expires_at: expiresAt,
  });

  return { userDetails, accessToken, refreshToken };
};

export const deleteToken = async (user_uuid, role_uuid) => {
  await deleteRefreshToken(user_uuid, role_uuid);
};

export const getRefreshToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.SECRETKEY);
  const token = await selectRefreshToken(decoded.id, decoded.role);
  if (!token) {
    throw new CustomError("Please authenticate yourself!", 401);
  }
  if (token.token !== refreshToken) {
    throw new CustomError("Please authenticate yourself!", 401);
  }
  const accessToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    process.env.SECRETKEY,
    {
      expiresIn: process.env.ACCESSTOKENEXPIRY,
    }
  );
  return accessToken;
};

export const sendPasswordResetEmail = async (email) => {
  const user = await findUser({ email });
  if (!user) throw new CustomError("User not found, Please register!", 404);

  // create a resetToken
  const token = crypto.randomBytes(32).toString("hex");
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const resetTokenExpiry = new Date(
    Date.now() + parseInt(process.env.RESET_TOKEN_EXPIRY)
  );

  await savePasswordResetToken(user, { resetToken, resetTokenExpiry });

  await sendResetEmail(email, token);
};

export const passwordReset = async (token, newPassword) => {
  const validPassword = validatePassword(newPassword);

  if (!validatePassword) {
    throw new CustomError(validPassword, 400);
  }
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await findUserByResetToken(resetToken);

  if (!user || user.reset_token_expiry > Date.now())
    throw new CustomError(
      "Invalid or expired reset token. Please request a new password reset.",
      401
    );

  await updateUserPassword(user, user.password, newPassword);
  await clearResetToken(user.uuid);
};
