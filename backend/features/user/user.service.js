import {
  createUser,
  getUserAndRolesByEmailOrPhone,
} from "../user/user.repository.js";
import validator from "validator";
import { getRoleId } from "../role/role.repository.js";
import { createUserRole } from "../user_role/user_role.repository.js";

function validatePassword(password) {
  const minLength = /.{8,}/; // At least 8 characters
  const hasLowercase = /[a-z]/; // At least one lowercase letter
  const hasUppercase = /[A-Z]/; // At least one uppercase letter
  const hasDigit = /[0-9]/; // At least one digit
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

  if (!minLength.test(password)) {
    return "Password must be at least 8 characters long.";
  }
  if (!hasLowercase.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!hasUppercase.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!hasDigit.test(password)) {
    return "Password must contain at least one digit.";
  }
  if (!hasSpecialChar.test(password)) {
    return "Password must contain at least one special character.";
  }

  return true;
}

export const getUserByEmailOrPhone = async (email, phone, roleType) => {
  try {
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
      return { newUser, newRole };
    } else {
      const newUserRole = await createUserRole(user.uuid, role.uuid);
      newRole = true;
      return {
        newUser,
        newRole,
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
        message: `You are already registered with us as ${user.Roles[0].name}, please use same set of credentials to login`,
      };
    }
  } catch (error) {
    // couldn't find user
    throw new Error(error.message || "Unable to get user details");
  }
};

export const addUser = async (userDetails, role) => {
  try {
    if (!validator.isEmail(userDetails.email)) {
      throw new Error("Please enter correct email address");
    }

    if (validatePassword(userDetails.password) !== true) {
      throw new Error(validatePassword(userDetails.password));
    }

    // creates new user
    const newuser = await createUser({ ...userDetails });

    // gets role id for given user
    const newrole = await getRoleId(role);

    // generates a new role in roles table
    const newUserRole = await createUserRole(newuser.uuid, newrole.uuid);

    return newuser;
  } catch (error) {
    throw new Error(error.message || "Unable to create new user at the moment");
  }
};
