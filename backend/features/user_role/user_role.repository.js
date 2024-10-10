import logger from "../../utils/logger.js";
import database from "../../models/index.js";
const { UserRole } = database.db;

export const createUserRole = async (user_uuid, role_uuid, transaction) => {
  const user_role = await UserRole.create(
    {
      role_uuid: role_uuid,
      user_uuid: user_uuid,
    },
    {
      transaction,
    }
  );
  logger.info({
    operation: "database insertion",
    data: {
      user_role: user_role,
    },
  });
  return user_role;
};

export const getUserRoles = async (user_uuid) => {
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
};
