import jwt from "jsonwebtoken";
import { findUserById } from "../features/user/user.repository.js";
import logger from "../utils/logger.js";

const secretKey = process.env.SECRETKEY;

const auth = async (req, res, next) => {
  try {
    // get token from header
    const token = req.header("Authorization").replace("Bearer ", "");
    // verfiy and decode token
    const decoded = jwt.verify(token, secretKey);

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
  } catch (error) {
    res.status(401).send("Please authenticate!!");
    logger.error(`Access by unauthorized user at ${req.url} and ${req.method}`);
  }
};

export default auth;
