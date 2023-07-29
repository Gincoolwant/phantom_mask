'use strict'
const usersList = require('../data/usersTable.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = usersList.map(user => {
      const { name, cashBalance } = user
      return { name, cash_balance: cashBalance }
    })

    return queryInterface.bulkInsert('Users', users, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
