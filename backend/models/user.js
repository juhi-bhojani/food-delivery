import { Model } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
  path: join(__dirname, "../", "dev.env"),
});

const secretKey = process.env.SECRETKEY;
const accessTokenExpiry = process.env.ACCESSTOKENEXPIRY;
const refreshTokenExpiry = process.env.REFRESHTOKENEXPIRY;

export default (sequelize, DataTypes) => {
  class User extends Model {
    // define association here
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: "user_uuid",
        otherkey: "role_uuid",
      });
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^\+\d{1,4}$/, // Validates that country code starts with + and has 1-4 digits
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          is: /^[0-9]{7,15}$/, // Only numbers, 7 to 15 digits for the local part
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
      },
      reset_token: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for users without a reset token
      },
      created_by: {
        type: DataTypes.UUID,
      },
      updated_by: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true, // Automatically adds createdAt and updatedAt
      createdAt: "created_at", // Custom name for createdAt
      updatedAt: "updated_at", // Custom name for updatedAt
      paranoid: true, // enables soft deletion with deletedAt
      deletedAt: "deleted_at", // custom name for deletedAt
    }
  );

  // Using beforeCreate and beforeUpdate hooks to hash the password
  User.addHook("beforeCreate", async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  });

  User.addHook("beforeUpdate", async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  });
  User.prototype.validatePassword = async function (password) {
    // Compare the provided password with the stored hashed password
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.generateAuthToken = async function (roles) {
    try {
      const role = roles;
      const user = this;
      // first argument is payload, second is secret
      const accessToken = jwt.sign({ id: user.uuid, role }, secretKey, {
        expiresIn: accessTokenExpiry,
      });
      const refreshToken = jwt.sign({ id: user.uuid, role }, secretKey, {
        expiresIn: refreshTokenExpiry,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error("Unable to authenticate!");
    }
  };

  return User;
};
