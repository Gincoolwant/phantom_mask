const express = require('express')
const router = express.Router()
const { Pharmacy, Mask } = require('../../models')
const { Op, Sequelize } = require('sequelize')
const { matchSorter } = require('match-sorter')

router.get('/:searchingTerm', async (req, res) => {
  try {
    const term = req.params.searchingTerm
    const pharmacies = await Pharmacy.findAll({
      attributes: ['name'],
      where: {
        name: { [Op.like]: `%${term}%` }
      },
      group: ['name'],
      raw: true
    })

    const masks = await Mask.findAll({
      attributes: [[Sequelize.literal('CONCAT(name, \' (\', color, \') (\', unit_per_pack, \' per pack)\')'), 'name']],
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${term}%` } },
          { color: { [Op.like]: `%${term}%` } }
        ]
      },
      group: ['name'],
      raw: true
    })
    console.log(pharmacies, masks)
    const rankingResult = matchSorter([...pharmacies, ...masks], term, { keys: ['name'] })
    res.status(200).json(rankingResult)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
