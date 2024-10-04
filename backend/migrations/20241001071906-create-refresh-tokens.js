"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("refresh_tokens", {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users", // Name of the User table
          key: "uuid", // Primary key in the User table
        },
        onDelete: "CASCADE",
      },
      role_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "roles", // Name of the Role table
          key: "uuid", // Primary key in the Role table
        },
        onDelete: "CASCADE",
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
    // Adding a unique constraint on the combination of user_uuid and role_uuid
    await queryInterface.addConstraint("refresh_tokens", {
      fields: ["user_uuid", "role_uuid"],
      type: "unique",
      name: "unique_user_role_combination", // Optional: name for the constraint
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the unique constraint first
    await queryInterface.removeConstraint(
      "refresh_tokens",
      "unique_user_role_combination"
    );
    await queryInterface.dropTable("refresh_tokens");
  },
};
