import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
const { combine, timestamp, json } = winston.format;

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transport = new DailyRotateFile({
  filename: "food-application-%DATE%.log", // This filename can include the %DATE% placeholder which will include the formatted datePattern at that point in the filename.
  datePattern: "YYYY-MM-DD",
  dirname: path.join(__dirname, "../logs"), // directory where log files will be saved
  maxSize: "20m", // rotates after this maxFile is observed
  maxFiles: "14d", // Maximum number of old logs to keep
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss A", // 2022-01-25 03:23:10.350 PM
    }),
    json()
  ),
  transports: [transport, new winston.transports.Console()],
});

export default logger;
