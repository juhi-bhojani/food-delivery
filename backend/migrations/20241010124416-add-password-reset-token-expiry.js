"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "reset_token_expiry", {
      type: Sequelize.DATE,
      allowNull: true, // You can set this to false if you want the column to be mandatory
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "reset_token_expiry");
  },
};
