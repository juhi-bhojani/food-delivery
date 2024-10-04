import logger from "../../utils/logger.js";
import { Op } from "sequelize";
import database from "../../models/index.js";
import CustomError from "../../utils/customError.js";
const { User, Role, UserRole } = database.db;

// setting internal server error in case unable to fetch response from database

export const findUserByEmailOrPhone = async (email, phone) => {
  try {
    const user = await User.findAll({
      where: {
        [Op.or]: [{ phone_number: phone }, { email: email }],
      },
    });
    logger.info({
      operation: "database query",
      data: {
        user: user,
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

export const createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    const { first_name, last_name, email, uuid } = newUser;
    logger.info({
      operation: "database insertion",
      data: {
        user: newUser,
      },
    });
    return { first_name, last_name, email, uuid };
  } catch (error) {
    logger.error({
      location: "User Repository",
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const getUserAndRolesByEmailOrPhone = async (email, phone) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { phone_number: phone }],
      },
      include: [
        {
          model: Role,
          through: {
            model: UserRole,
          },
          attributes: ["name"], // select name field from role
        },
      ],
      attributes: ["uuid", "first_name", "last_name", "email", "phone_number"],
    });
    logger.info({
      operation: "database query",
      data: {
        user: user,
      },
    });
    return user;
  } catch (error) {
    logger.error({
      location: "User Repository",
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};

export const findUserById = async (uuid) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: uuid,
      },
    });
    logger.info({
      operation: "database query",
      data: {
        user: user,
      },
    });
    return user;
  } catch (error) {
    logger.error({
      location: "User Repository",
      error: error,
    });
    throw new CustomError("Internal Server Error", 500);
  }
};
