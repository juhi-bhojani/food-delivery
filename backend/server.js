import express from "express";
import database from "./models/index.js";
import userRouter from "./features/user/user.route.js";
import authRouter from "./features/authentication/auth.route.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
  path: join(__dirname, "../", "dev.env"),
});

const corsOptions = {
  origin: "http://localhost:8080", // Frontend origin
  credentials: true, // Allow sending cookies
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/v1/", userRouter);
app.use("/api/v1/", authRouter);

app.get("/", async (req, res) => {
  res.send("Hello");
});

app.listen(3000, () => {
  database.check();
  console.log("Listening to port");
});
