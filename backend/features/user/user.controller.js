import { getUserByEmailOrPhone, addUser } from "./user.service.js";
import { asyncErrorHandler } from "../../utils/globalErrorHandler.js";
import CustomError from "../../utils/customError.js";

export const registerUser = asyncErrorHandler(async (req, res) => {
  const { first_name, last_name, email, phone_number, password, role, dob } =
    req.body;

  // validate user body
  if (!first_name || !last_name || !email || !phone_number || !password) {
    throw new CustomError("Missing Required Fields", 400);
  }

  // check if email or phone number is already in use
  const existingUser = await getUserByEmailOrPhone(
    email,
    phone_number,
    role || "Customer"
  );

  if (!existingUser.newUser) {
    if (!existingUser.newRole) {
      throw new CustomError(
        "User with this phone or email already exists",
        400
      );
    } else {
      return res.status(200).json({
        status: "Success",
        message: existingUser.message,
        data: {
          user: existingUser.user,
        },
      });
    }
  }

  // creating new user
  const newUser = await addUser(
    {
      first_name,
      last_name,
      phone_number,
      email,
      password,
      dob,
    },
    role || "Customer"
  );
  res.status(200).json({
    status: "success",
    data: {
      user: {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
      },
    },
  });
});

export const userProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "Success",
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Sorry, Internal server error!",
    });
  }
};
