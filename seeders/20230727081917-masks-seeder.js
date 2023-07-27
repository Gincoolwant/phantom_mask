'use strict'
const pharmaciesList = require('../data/pharmaciesTable.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const masksList = []
    pharmaciesList.forEach(pharmacy => {
      pharmacy.masks.forEach(mask => {
        const { name, color, unitPerPack } = mask
        masksList.push({ name, color, unitPerPack })
      })
    })

    return queryInterface.bulkInsert('Masks', [...new Set(masksList.map(mask => JSON.stringify(mask)))].map(mask => JSON.parse(mask))
      , {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Masks', null, {})
  }
}
