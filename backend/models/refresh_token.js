import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    // Define associations here if needed
    static associate(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: "user_uuid",
        onDelete: "CASCADE", // Delete refresh tokens when the user is deleted
      });
      RefreshToken.belongsTo(models.Role, {
        foreignKey: "role_uuid",
        onDelete: "CASCADE", // Delete refresh tokens when the role is deleted
      });
    }
  }

  RefreshToken.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_uuid: {
        type: DataTypes.UUID,
        allowNull: false, // Should not be null
        references: {
          model: "users", // Name of the User table
          key: "uuid", // Primary key in the User table
        },
        onDelete: "CASCADE",
      },
      role_uuid: {
        type: DataTypes.UUID,
        allowNull: false, // Should not be null
        references: {
          model: "roles", // Name of the Role table
          key: "uuid", // Primary key in the Role table
        },
        onDelete: "CASCADE",
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false, // Should not be null
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false, // Should not be null
      },
    },
    {
      sequelize,
      modelName: "RefreshToken",
      tableName: "refresh_tokens",
      timestamps: true, // Automatically adds createdAt and updatedAt
      createdAt: "created_at", // Custom name for createdAt
      updatedAt: "updated_at", // Custom name for updatedAt
      indexes: [
        {
          unique: true,
          fields: ["user_uuid", "role_uuid"], // Unique combination of user_uuid and role_uuid
        },
      ],
    }
  );

  return RefreshToken;
};
