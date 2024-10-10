import logger from "../../utils/logger.js";
import database from "../../models/index.js";
import bcrypt from "bcryptjs";
const { User, RefreshToken } = database.db;

export const findUser = async (user) => {
  const userDetails = await User.findOne({
    where: { email: user.email },
  });
  logger.info({
    operation: "database query",
    data: {
      user: userDetails,
    },
  });
  return userDetails;
};

export const storeRefreshToken = async (tokenDetails) => {
  const refreshToken = await RefreshToken.findOne({
    where: {
      user_uuid: tokenDetails.user_uuid,
      role_uuid: tokenDetails.role_uuid,
    },
  });

  if (refreshToken) {
    // Update the existing token
    await refreshToken.update({
      token: tokenDetails.token,
      expires_at: tokenDetails.expires_at,
    });
  } else {
    // Create a new refresh token
    await RefreshToken.create(tokenDetails);
  }

  logger.info({
    operation: "database query",
    data: {
      refresh_token: refreshToken,
    },
  });

  return refreshToken;
};

export const deleteRefreshToken = async (user_uuid, role_uuid) => {
  const token = await RefreshToken.destroy({
    where: {
      user_uuid,
      role_uuid,
    },
  });

  logger.info({
    operation: "database deletion",
    data: {
      refresh_token: token,
    },
  });
  return token;
};

export const selectRefreshToken = async (user_uuid, role_uuid) => {
  const token = await RefreshToken.findOne({
    where: {
      user_uuid: user_uuid,
      role_uuid: role_uuid,
    },
  });
  logger.info({
    operation: "database query",
    data: {
      refresh_token: token,
    },
  });
  return token;
};

export const savePasswordResetToken = async (
  user_uuid,
  { resetToken, resetTokenExpiry }
) => {
  await User.update(
    {
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry,
    },
    {
      where: { uuid: user_uuid },
    }
  );
};

export const findUserByResetToken = async (token) => {
  const user = await User.findOne({
    where: {
      reset_token: token,
    },
  });
  return user;
};

export const clearResetToken = async (user_uuid) => {
  await User.update(
    {
      reset_token: null,
    },
    {
      where: { uuid: user_uuid },
    }
  );
};

export const updateUserPassword = async (user_uuid, password) => {
  const hashedPassword = await bcrypt.hash(password, 8);
  await User.update(
    {
      password: hashedPassword,
    },
    {
      where: { uuid: user_uuid },
    }
  );
};
