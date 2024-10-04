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
import moment from "moment";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const loginUser = async (user, roleType) => {
  try {
    const userDetails = await findUser(user);
    const expiresAt = moment().add(7, "days").toDate();

    if (!userDetails) {
      throw new Error("User doesn't exist, Please Register!");
    }
    if (!(await userDetails.validatePassword(user.password))) {
      throw new Error("Incorrect email or password");
    }

    const userRole = await getUserRoles(userDetails.uuid);

    // get role id based on role and then compare if user has given role
    const role = await getRoleId(roleType);

    if (!userRole.includes(role.uuid)) {
      throw new Error("User doesn't exist, Please register!");
    }

    const { accessToken, refreshToken } = await userDetails.generateAuthToken(
      role.uuid
    );

    // storing access and refresh tokens in db
    const tokenDetails = await storeRefreshToken({
      token: refreshToken,
      user_uuid: userDetails.uuid,
      role_uuid: role.uuid,
      expires_at: expiresAt,
    });

    return { userDetails, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error.message || "Unable to login user");
  }
};

export const deleteToken = async (user_uuid, role_uuid) => {
  try {
    const token = await deleteRefreshToken(user_uuid, role_uuid);
    return token;
  } catch (error) {
    throw new Error("Unable to logout!");
  }
};

export const getRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRETKEY);
    const token = await selectRefreshToken(decoded.id, decoded.role);
    if (!token) {
      throw new Error();
    }
    if (token !== refreshToken) {
      throw new Error();
    }
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.SECRETKEY,
      {
        expiresIn: process.env.ACCESSTOKENEXPIRY,
      }
    );
    return accessToken;
  } catch (error) {
    throw new Error("Unable to authenticate, please login!");
  }
};

export const sendPasswordResetEmail = async (email) => {
  const user = await findUser({ email });
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");

  await savePasswordResetToken(user.uuid, resetToken);

  // send email
  await sendResetEmail(email, token);
};

export const passwordReset = async (token, newPassword) => {
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await findUserByResetToken(resetToken);

  if (!user) throw new Error("Invalid or expired reset token");

  await updateUserPassword(user.uuid, newPassword);
  await clearResetToken(user.uuid);
};
