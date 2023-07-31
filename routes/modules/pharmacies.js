const express = require('express')
const router = express.Router()
const { Openinghour, Pharmacy, Product, Mask } = require('../../models')
const { Op, Sequelize } = require('sequelize')

router.get('/openingHours', async (req, res, next) => {
  try {
    const time = req.query.time
    const map = { mon: 1, tue: 2, wed: 3, thur: 4, fri: 5, sat: 6, sun: 0 }
    const weekDay = map[req.query.day?.toLowerCase()]
    const openingPharmacy = await Openinghour.findAll({
      include: [
        {
          model: Pharmacy,
          attributes: [],
          required: true
        }
      ],
      attributes: [
        [Sequelize.col('Pharmacy.name'), 'pharmacyName'],
        [Sequelize.literal(`CASE day_of_week
            WHEN 1 THEN 'Mon' WHEN 2 THEN 'Tue'
            WHEN 3 THEN 'Wed' WHEN 4 THEN 'Thur'
            WHEN 5 THEN 'Fri' WHEN 6 THEN 'Sat'
            WHEN 0 THEN 'Sun' END`), 'dayOfWeek'],
        ['open', 'openHour'],
        ['close', 'closeHour']],
      where: {
        ...weekDay ? { dayOfWeek: weekDay } : {},
        ...time ? { open: { [Op.lte]: time }, close: { [Op.gte]: time } } : {}
      }
    })

    res.status(200).json(openingPharmacy)
  } catch (err) {
    next(err)
  }
})

router.get('/stocks', async (req, res, next) => {
  try {
    const threshold = Number(req.query.num) || 0
    const [lowerBond, upperBond] = req.query.priceRange.split('-')
    const pharmacies = await Pharmacy.findAll({
      attributes: [['id', 'pharmacyId'], ['name', 'pharmacyName']],
      include: [
        {
          model: Product,
          attributes: [
            [Sequelize.literal('CONCAT(`Products->Mask`.name, \' (\', `Products->Mask`.color, \') (\', `Products->Mask`.unit_per_pack, \' per pack)\')'), 'maskName'],
            [Sequelize.literal('`Products`.price'), 'price']],
          where: {
            price: {
              ...upperBond ? { [Op.between]: [lowerBond, upperBond] } : { [Op.gte]: lowerBond }
            }
          },
          include: [{
            model: Mask,
            attributes: []
          }],
          required: true
        }]
    })

    const fulfillPharmacies = pharmacies.filter(pharmacy => {
      return pharmacy.Products.length >= threshold
    })

    const lackPharmacies = pharmacies.filter(pharmacy => {
      return pharmacy.Products.length < threshold
    })

    res.status(200).json({
      Higher: fulfillPharmacies.length > 0 ? fulfillPharmacies : null,
      Lower: lackPharmacies.length > 0 ? lackPharmacies : null
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:pharmacyName/masks', async (req, res, next) => {
  try {
    const order = req.query.order.toLowerCase() === 'name' ? 'Mask.name' : 'price'
    const pharmacyName = req.params.pharmacyName
    const productsSoldInPharmacy = await Mask.findAll({
      attributes: [
        [Sequelize.literal('CONCAT(Mask.name, \' (\', Mask.color, \') (\', Mask.unit_per_pack, \' per pack)\')'), 'maskName'],
        [Sequelize.literal('Products.price'), 'price']],
      include: [
        {
          model: Product,
          attributes: [],
          required: true,
          include: [{
            model: Pharmacy,
            attributes: [],
            where: {
              name: pharmacyName
            }
          }]
        }],
      order: [Sequelize.literal(`${order} ASC`)]
    })
    res.status(200).json(productsSoldInPharmacy)
  } catch (err) {
    next(err)
  }
})

module.exports = router
/**
 * @swagger
 * tags:
 *   name: Pharmacies
 *   description: The Pharmacies API
 * /pharmacies/openingHours:
 *   get:
 *     summary: List all pharmacies open at a specific time and on a day of the week if requested.
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: time
 *         description: specific time \[hh:mm\]
 *         schema:
 *            type: string
 *         required: true
 *       - in: query
 *         name: day
 *         description: The day of week \[Mon, Tue, Wed, Thur, Fir, Sat, Sun\]
 *         schema:
 *            type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/openingHours'
 *       500:
 *         description: Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failCase'
 *
 * /pharmacies/stocks:
 *   get:
 *     summary: List all pharmacies with more or less than x mask products within a price range.
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: num
 *         description: The threshold values of different masks
 *         schema:
 *            type: integer
 *         required: true
  *       - in: query
 *         name: priceRange
 *         description: The range of price
 *         schema:
 *            type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/stocks'
 *       500:
 *         description: Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failCase'
 *
 * /pharmacies/{pharmacyName}/masks:
 *   get:
 *     summary: List all masks sold by a given pharmacy, sorted by mask name or price.
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: order
 *         description: sorting term [name / price]
 *         schema:
 *            type: string
 *         required: true
 *       - in: path
 *         name: pharmacyName
 *         description: The name of the pharmacy
 *         schema:
 *            type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/masks'
 *       500:
 *         description: Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failCase'
 */
