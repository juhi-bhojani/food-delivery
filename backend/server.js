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

const allowedOrigins = ["http://localhost:8080", "http://192.1.200.190:8080"];

// Set up CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable set cookie on the client side
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

// app.listen(3000, "192.1.200.190", () => {
//   database.check();
//   console.log("Listening to port");
// });

app.listen(3000, () => {
  database.check();
  console.log("Listening to port");
});
