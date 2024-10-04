import logger from "../../utils/logger.js";
import database from "../../models/index.js";
const { UserRole } = database.db;
import CustomError from "../../utils/customError.js";

export const createUserRole = async (user_uuid, role_uuid) => {
  try {
    const user_role = await UserRole.create({
      role_uuid: role_uuid,
      user_uuid: user_uuid,
    });
    if (!user_role) {
      throw new Error("Unable to create given user role!");
    }
    logger.info({
      operation: "database insertion",
      data: {
        user_role: user_role,
      },
    });
    return user_role;
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const getUserRoles = async (user_uuid) => {
  try {
    const roles = await UserRole.findAll({
      where: {
        user_uuid,
      },
    });
    logger.info({
      operation: "database query",
      data: {
        user_role: roles,
      },
    });
    return roles.map((role) => role.role_uuid);
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};
