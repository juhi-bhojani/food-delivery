import jwt from "jsonwebtoken";
import { findUserById } from "../features/user/user.repository.js";
import logger from "../utils/logger.js";
import { getRefreshToken } from "../features/authentication/auth.service.js";

const secretKey = process.env.SECRETKEY;

const auth = async (req, res, next) => {
  try {
    console.log("req.cookies", req.cookies);
    const { refreshToken, accessToken } = req.cookies;
    // const refreshToken = req.cookies.refreshToken;
    // const accessToken = req.cookies.accessToken;
    if (refreshToken) {
      if (!accessToken) {
        accessToken = await getRefreshToken(req.cookies.refreshToken);
        res.cookie("accessToken", accessToken, {
          // httpOnly: true,
          // sameSite: "strict", // prevents CSRF attacks
          maxAge: 60 * 60 * 1000, // 60 minutes
        });
      }
      // verfiy and decode token
      const decoded = jwt.verify(accessToken, secretKey);

      // check if user exists
      const user = await findUserById(decoded.id);
      if (!user) {
        throw new Error();
      }
      // attaching user details with request
      req.user = user;
      req.role = decoded.role;

      // calling next middleware
      next();
    } else {
      throw new Error("no refresh token");
    }
  } catch (error) {
    console.log(error);

    res.status(401).send("Please authenticate!!");
    logger.error(`Access by unauthorized user at ${req.url} and ${req.method}`);
  }
};

export default auth;
