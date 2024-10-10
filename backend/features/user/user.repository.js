import logger from "../../utils/logger.js";
import { Op } from "sequelize";
import database from "../../models/index.js";
const { User, Role, UserRole } = database.db;

export const findUserByEmailOrPhone = async (email, phone) => {
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
};

export const createUser = async (user, t) => {
  const newUser = await User.create(user, { transaction: t });
  const { first_name, last_name, email, uuid } = newUser;
  logger.info({
    operation: "database insertion",
    data: {
      user: newUser,
    },
  });
  return { first_name, last_name, email, uuid };
};

export const getUserAndRolesByEmailOrPhone = async (email, phone) => {
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
};

export const findUserById = async (uuid) => {
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
};
