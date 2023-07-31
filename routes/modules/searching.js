const express = require('express')
const router = express.Router()
const { Pharmacy, Mask } = require('../../models')
const { Op, Sequelize } = require('sequelize')
const { matchSorter } = require('match-sorter')

router.get('/:searchingTerm', async (req, res, next) => {
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
    const rankingResult = matchSorter([...pharmacies, ...masks], term, { keys: ['name'] })
    res.status(200).json(rankingResult)
  } catch (err) {
    next(err)
  }
})

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Searching
 *   description: The searching API
 * /searching/{searchingTerm}:
 *   get:
 *     summary: Search for pharmacies or masks by name, ranked by relevance to the search term.
 *     tags: [Searching]
 *     parameters:
 *       - in: path
 *         name: searchingTerm
 *         description: The searching term of pharmacies and masks
 *         schema:
 *            type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/searching'
 *       500:
 *         description: Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failCase'
 *
 */
