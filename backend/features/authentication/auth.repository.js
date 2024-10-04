import logger from "../../utils/logger.js";
import database from "../../models/index.js";
import bcrypt from "bcryptjs";
const { User, RefreshToken } = database.db;
import CustomError from "../../utils/customError.js";

export const findUser = async (user) => {
  try {
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
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const storeRefreshToken = async (tokenDetails) => {
  try {
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
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const deleteRefreshToken = async (user_uuid, role_uuid) => {
  try {
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
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const selectRefreshToken = async (user_uuid, role_uuid) => {
  try {
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
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const savePasswordResetToken = async (user_uuid, resetToken) => {
  try {
    await User.update(
      {
        reset_token: resetToken,
      },
      {
        where: { uuid: user_uuid },
      }
    );
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const findUserByResetToken = async (token) => {
  try {
    const user = await User.findOne({
      where: {
        reset_token: token,
      },
    });
    return user;
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const clearResetToken = async (user_uuid) => {
  try {
    await User.update(
      {
        reset_token: null,
      },
      {
        where: { uuid: user_uuid },
      }
    );
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const updateUserPassword = async (user_uuid, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: { uuid: user_uuid },
      }
    );
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};
