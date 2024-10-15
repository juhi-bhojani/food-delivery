import jwt from "jsonwebtoken";
import { findUserById } from "../features/user/user.repository.js";
import logger from "../utils/logger.js";
import { getRefreshToken } from "../features/authentication/auth.service.js";

const secretKey = process.env.SECRETKEY;

const auth = async (req, res, next) => {
  try {
    let { refreshToken, accessToken } = req.cookies;
    if (refreshToken) {
      if (!accessToken) {
        accessToken = await getRefreshToken(refreshToken);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: process.env.ACCESS_TOKEN_EXPIRY_COOKIE,
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
      req.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        uuid: user.uuid,
      };
      req.role = decoded.role;

      // calling next middleware
      next();
    } else {
      res.clearCookie("accessToken");
      throw new Error();
    }
  } catch (error) {
    res.status(401).send("Please authenticate!!");
    logger.error(`Access by unauthorized user at ${req.url} and ${req.method}`);
  }
};

export default auth;
