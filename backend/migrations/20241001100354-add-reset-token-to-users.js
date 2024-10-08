module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "reset_token", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "reset_token");
  },
};
