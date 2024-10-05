"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert data into the 'Roles' table
    return queryInterface.bulkInsert(
      "roles",
      [
        {
          uuid: "124e0794-e13a-4496-b808-2dc7613a4687",
          name: "Customer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "cb17cd3d-3c94-4e94-a585-23d1c21d5776",
          name: "Admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "ce9c6a26-fc73-4535-b45d-be092b51c6b9",
          name: "delivery_partner",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "03d07755-f406-493f-bc43-904f0915d073",
          name: "Restaurant",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally delete the inserted data when rolling back
    return queryInterface.bulkDelete("Roles", null, {});
  },
};
