'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OpeningHours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pharmacyId: {
        type: Sequelize.INTEGER,
        references: { model: 'Pharmacies', key: 'id' }
      },
      dayOfWeek: {
        type: Sequelize.INTEGER
      },
      open: {
        type: Sequelize.TIME
      },
      close: {
        type: Sequelize.TIME
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('OpeningHours');
  }
};