'use strict'
const pharmaciesList = require('../data/pharmaciesTable.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const openingHours = []
    const weekDays = { Mon: 1, Tue: 2, Wed: 3, Thur: 4, Fri: 5, Sat: 6, Sun: 0 }
    for (const pharmacy of pharmaciesList) {
      const pharmacyId = await queryInterface.sequelize.query(
        'SELECT id FROM Pharmacies WHERE name = :name;',
        {
          replacements: { name: `${pharmacy.name}` },
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )

      pharmacy.openingTimes.forEach(time => {
        openingHours.push({
          pharmacyId: pharmacyId[0].id,
          dayOfWeek: weekDays[time.openDay],
          open: time.openTime.split(' - ')[0],
          close: time.openTime.split(' - ')[1]
        })
      })
    }

    return queryInterface.bulkInsert('OpeningHours', openingHours, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OpeningHours', null, {})
  }
}
