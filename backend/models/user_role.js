import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class UserRole extends Model {}
  UserRole.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_uuid: {
        type: DataTypes.UUID,
        allowNull: false, // Set to false since it shouldn't be null
        references: {
          model: "users", // Name of the User table
          key: "uuid", // Primary key in the User table
        },
        onDelete: "CASCADE", // Optional: Define behavior on user deletion
      },
      role_uuid: {
        type: DataTypes.UUID,
        allowNull: false, // Set to false since it shouldn't be null
        references: {
          model: "roles", // Name of the Role table
          key: "uuid", // Primary key in the Role table
        },
        onDelete: "CASCADE", // Optional: Define behavior on role deletion
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
      modelName: "UserRole",
      tableName: "user_roles",
      timestamps: true, // Automatically adds createdAt and updatedAt
      createdAt: "created_at", // Custom name for createdAt
      updatedAt: "updated_at", // Custom name for updatedAt
      paranoid: true, // enables soft deletion with deletedAt
      deletedAt: "deleted_at", // custom name for deletedAt
    }
  );
  return UserRole;
};
