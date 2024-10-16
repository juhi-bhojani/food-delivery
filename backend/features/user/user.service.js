import {
  createUser,
  getUserAndRolesByEmailOrPhone,
} from "../user/user.repository.js";
import validator from "validator";
import { getRoleId } from "../role/role.repository.js";
import { createUserRole } from "../user_role/user_role.repository.js";
import decryptData from "../../utils/decryptPassword.js";
import database from "../../models/index.js";
const { sequelize } = database.db;
import CustomError from "../../utils/customError.js";
import validatePassword from "../../utils/validatePassword.js";

export const getUserByEmailOrPhone = async (email, phone, roleType) => {
  const user = await getUserAndRolesByEmailOrPhone(email, phone);
  let newUser = false;
  let newRole = false;
  if (!user) {
    newUser = true;
    newRole = true;
    // if no user exists then
    return { newUser, newRole };
  }
  // getting role for current login endpoint
  const role = await getRoleId(roleType);
  // check if role exists for given user
  const role_exists = user.Roles.find(
    (user_role) => role.name === user_role.name
  );
  if (role_exists) {
    // user exists for given role, directly allow login
    return { newUser, newRole };
  } else {
    // new user role created for existing user
    await createUserRole(user.uuid, role.uuid);
    newRole = true;
    return {
      newUser,
      newRole,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      message: `You are already registered with us as ${user.Roles[0].name}, Please use same set of credentials to login`,
    };
  }
};

export const addUser = async (userDetails, role) => {
  if (!validator.isEmail(userDetails.email)) {
    throw new CustomError("Please enter correct email address", 400);
  }

  userDetails.password = decryptData(userDetails.password);

  const validPassword = validatePassword(userDetails.password);

  if (validPassword !== true) {
    throw new CustomError(validPassword, 400);
  }
  try {
    const transaction = await sequelize.transaction();

    // creates new user
    const newuser = await createUser({ ...userDetails }, transaction);

    // gets role id for given user
    const newrole = await getRoleId(role);

    // generates a new role in roles table
    await createUserRole(newuser.uuid, newrole.uuid, transaction);

    await transaction.commit();

    return newuser;
  } catch (error) {
    await transaction.rollback();
    throw new CustomError("Internal Server Error!", 500);
  }
};
