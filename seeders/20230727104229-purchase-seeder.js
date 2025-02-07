'use strict'
const purchaseList = require('../data/usersTable.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const histories = []
    for (const record of purchaseList) {
      for (const history of record.purchaseHistories) {
        const { pharmacyName, name, color, unitPerPack, transactionAmount, transactionDate } = history
        const [{ pharmacyId }] = await queryInterface.sequelize.query(
          'SELECT id as pharmacyId FROM Pharmacies WHERE name = :pharmacyName;',
          {
            replacements: { pharmacyName },
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

        const [{ userId }] = await queryInterface.sequelize.query(
          'SELECT id as userId FROM Users WHERE name = :name;',
          {
            replacements: { name: `${record.name}` },
            type: queryInterface.sequelize.QueryTypes.SELECT
          }
        )

        const [{ productId }] = await queryInterface.sequelize.query(
          'SELECT id as productId FROM Products WHERE pharmacy_id = :pharmacyId AND mask_id = :maskId;',
          {
            replacements: { pharmacyId, maskId },
            type: queryInterface.sequelize.QueryTypes.SELECT
          }
        )

        histories.push({ user_id: userId, product_id: productId, trans_amount: transactionAmount, trans_date: new Date(transactionDate) })
      }
    }
    return queryInterface.bulkInsert('Purchases', histories, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Purchases', null, {})
  }
}
