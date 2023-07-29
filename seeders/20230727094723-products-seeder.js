'use strict'
const pharmaciesList = require('../data/pharmaciesTable.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = []
    for (const pharmacy of pharmaciesList) {
      for (const mask of pharmacy.masks) {
        const { name, price, color, unitPerPack } = mask
        const [{ pharmacyId }] = await queryInterface.sequelize.query(
          'SELECT id as pharmacyId FROM Pharmacies WHERE name = :name;',
          {
            replacements: { name: `${pharmacy.name}` },
            type: queryInterface.sequelize.QueryTypes.SELECT
          }
        )

        const [{ maskId }] = await queryInterface.sequelize.query(
          'SELECT id as maskId FROM Masks WHERE name = :name AND color = :color AND unit_per_pack = :unitPerPack;',
          {
            replacements: { name, color, unitPerPack },
            type: queryInterface.sequelize.QueryTypes.SELECT
          }
        )

        products.push({ pharmacy_id: pharmacyId, mask_id: maskId, price })
      }
    }
    return queryInterface.bulkInsert('Products', products, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {})
  }
}
