import logger from "../../utils/logger.js";
import database from "../../models/index.js";
const { Role } = database.db;

export const getRoleId = async (roleType) => {
  const role = await Role.findOne({
    where: {
      name: roleType,
    },
  });
  logger.info({
    operation: "database query",
    data: {
      role: role,
    },
  });
  return role;
};
