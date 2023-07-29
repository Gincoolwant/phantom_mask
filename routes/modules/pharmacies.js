const express = require('express')
const router = express.Router()
const { Openinghour, Pharmacy, Product, Mask } = require('../../models')
const { Op, Sequelize } = require('sequelize')

router.get('/openingHours', async (req, res) => {
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
        [Sequelize.col('Pharmacy.name'), 'name'],
        [Sequelize.literal(`CASE day_of_week
            WHEN 1 THEN 'Mon' WHEN 2 THEN 'Tue'
            WHEN 3 THEN 'Wed' WHEN 4 THEN 'Thur'
            WHEN 5 THEN 'Fri' WHEN 6 THEN 'Sat'
            WHEN 0 THEN 'Sun' END`), 'day_of_week'],
        'open',
        'close'],
      where: {
        ...weekDay ? { dayOfWeek: weekDay } : {},
        ...time ? { open: { [Op.lte]: time }, close: { [Op.gte]: time } } : {}
      }
    })

    res.status(200).json(openingPharmacy)
  } catch (err) {
    console.log(err)
  }
})

router.get('/stock', async (req, res) => {
  try {
    const stock = Number(req.query.num) || 0
    const [lowerBond, upperBond] = req.query.priceRange.split('-')

    const pharmacies = await Pharmacy.findAll({
      include: [
        {
          model: Mask,
          as: 'maskType',
          attributes: [
            [Sequelize.literal('CONCAT(maskType.name, \' (\', MaskType.color, \') (\', MaskType.unit_per_pack, \' per pack)\')'), 'name'],
            [Sequelize.literal('`maskType->Product`.price'), 'price']
          ],
          through: {
            model: Product,
            attributes: [],
            where: {
              price: {
                ...upperBond ? { [Op.between]: [lowerBond, upperBond] } : { [Op.gte]: lowerBond }
              }
            }
          },
          required: true
        }],
      attributes: ['id', 'name']
    })

    const fulfillPharmacies = pharmacies.filter(pharmacy => {
      return pharmacy.maskType.length >= stock
    })

    const neglectPharmacies = pharmacies.filter(pharmacy => {
      return pharmacy.maskType.length < stock
    })

    res.status(200).json([{ Fulfill: fulfillPharmacies, Lack: neglectPharmacies }])
  } catch (err) {
    console.log(err)
  }
})

router.get('/:pharmacyName/masks', async (req, res) => {
  try {
    const order = req.query.order === 'name' ? 'maskType.name' : 'price'
    const pharmacyName = req.params.pharmacyName
    const productsSoldInPharmacy = await Pharmacy.findAll({
      include: [
        {
          model: Mask,
          as: 'maskType',
          attributes: [
            [Sequelize.literal('CONCAT(maskType.name, \' (\', maskType.color, \') (\', maskType.unit_per_pack, \' per pack)\')'), 'name'],
            [Sequelize.literal('`maskType->Product`.price'), 'price']
          ],
          through: { model: Product, attributes: [] },
          required: true
        }],
      attributes: [],
      where: {
        name: pharmacyName
      },
      order: Sequelize.literal(`${order} ASC`),
      raw: true
    })
    res.status(200).json(productsSoldInPharmacy)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
