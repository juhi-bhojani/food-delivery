import logger from "../utils/logger.js";

export const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  logger.error({
    statusCode,
    message: error.message,
    stack: error.stack, // will be removed in case of production enviorment
  });

  const message = statusCode === 500 ? "Internal Server Error" : error.message;

  return res.status(statusCode).json({
    status: error.status,
    message,
  });
};
