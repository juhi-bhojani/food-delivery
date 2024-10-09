import logger from "../utils/logger.js";

export const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  logger.error({
    statusCode,
    message: error.message,
  });
  return res.status(statusCode).json({
    status: error.status,
    message: error.message,
  });
};
