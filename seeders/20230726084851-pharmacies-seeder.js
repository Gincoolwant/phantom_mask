'use strict'
const pharmaciesList = require('../data/pharmaciesTable.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const pharmacies = pharmaciesList.map(pharmacy => {
      const { name, cashBalance } = pharmacy
      return { name, cash_balance: cashBalance }
    })
    return queryInterface.bulkInsert('Pharmacies', pharmacies, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Pharmacies', null, {})
  }
}
