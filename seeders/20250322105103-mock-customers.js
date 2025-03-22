'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('customers', [
      {
        first_name: 'David',
        last_name: 'Beckham',
        email: 'david.beckham@football.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Wembley',
        last_name: 'Stadium',
        email: 'wembley.stadium@hall.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Queen',
        last_name: 'Elizabeth',
        email: 'queen.elizabeth@royal.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'London',
        last_name: 'Bridge',
        email: 'london.bridge@sights.com',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('customers', null, {});
  }
};
