import logger from "../../utils/logger.js";
import database from "../../models/index.js";
const { Role } = database.db;
import CustomError from "../../utils/customError.js";

export const getRoleId = async (roleType) => {
  try {
    const role = await Role.findOne({
      where: {
        name: roleType,
      },
    });
    if (!role) {
      throw new Error("No such role exists!");
    }

    logger.info({
      operation: "database query",
      data: {
        role: role,
      },
    });
    return role;
  } catch (error) {
    logger.error({
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};
