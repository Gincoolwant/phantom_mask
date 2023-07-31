const express = require('express')
const router = express.Router()
const { Pharmacy, Mask } = require('../../models')
const { Op, Sequelize } = require('sequelize')
const { matchSorter } = require('match-sorter')

router.get('/', async (req, res, next) => {
  try {
    const { keyword } = req.query
    const pharmacies = await Pharmacy.findAll({
      attributes: ['name'],
      where: {
        name: { [Op.like]: `%${keyword}%` }
      },
      group: ['name'],
      raw: true
    })

    const masks = await Mask.findAll({
      attributes: [[Sequelize.literal('CONCAT(name, \' (\', color, \') (\', unit_per_pack, \' per pack)\')'), 'name']],
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { color: { [Op.like]: `%${keyword}%` } }
        ]
      },
      group: ['name'],
      raw: true
    })
    const rankingResult = matchSorter([...pharmacies, ...masks], keyword, { keys: ['name'] })
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
 * /search:
 *   get:
 *     summary: Search for pharmacies or masks by name, ranked by relevance to the search term.
 *     tags: [Searching]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         description: The keyword in pharmacies or masks
 *         schema:
 *            type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/search'
 *       500:
 *         description: Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failCase'
 *
 */
