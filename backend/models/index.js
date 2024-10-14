import { Sequelize, DataTypes } from "sequelize";
import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import User from "./user.js";
import Role from "./role.js";
import UserRole from "./user_role.js";
import RefreshToken from "./refresh_token.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
  path: join(__dirname, "../", "dev.env"),
});

const database = process.env.DATABASE;
const user = process.env.USER;
const password = process.env.PASSWORD;

// connect to local database
const sequelize = new Sequelize(database, user, password, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User(sequelize, DataTypes);
db.Role = Role(sequelize, DataTypes);
db.UserRole = UserRole(sequelize, DataTypes);
db.RefreshToken = RefreshToken(sequelize, DataTypes);

// relationship between user and role
db.Role.belongsToMany(db.User, {
  through: db.UserRole,
  foreignKey: "role_uuid",
  otherkey: "user_uuid",
});
db.User.belongsToMany(db.Role, {
  through: db.UserRole,
  foreignKey: "user_uuid",
  otherkey: "role_uuid",
});

// relationship between refresh token and user and role
db.RefreshToken.belongsTo(db.User, {
  foreignKey: "user_uuid",
});

db.RefreshToken.belongsTo(db.Role, {
  foreignKey: "role_uuid",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // if migrations wasn't used then this line needs to be uncommented
    // await db.sequelize.sync({ alter: true, force: false });
    // console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default { db, connectDB };
