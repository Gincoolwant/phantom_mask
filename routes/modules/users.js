const express = require('express')
const router = express.Router()
const { User, Pharmacy, Purchase, Product, Mask, sequelize } = require('../../models')
const { Op, Sequelize } = require('sequelize')

router.get('/trans/userTopList', async (req, res, next) => {
  try {
    const defaultTop = 5
    const top = Number(req.query.top) || defaultTop
    const utcStartDate = new Date(req.query.dateRange.split('-')[0]).toUTCString()
    const endDate = req.query.dateRange?.split('-')[1]
    const utcEndDate = new Date(endDate).toUTCString()

    const topUsers = await Purchase.findAll({
      attributes: ['userId',
        [Sequelize.col('User.name'), 'userName'],
        [Sequelize.fn('SUM', Sequelize.col('trans_amount')), 'totalTransAmount']],
      where: {
        transDate: { ...endDate ? { [Op.between]: [utcStartDate, utcEndDate] } : { [Op.gte]: utcStartDate } }
      },
      include: [{
        model: User,
        attributes: [],
        required: true
      }],
      group: ['userId'],
      order: [[Sequelize.literal('totalTransAmount'), 'DESC']],
      limit: top
    })

    res.status(200).json(topUsers)
  } catch (err) {
    next(err)
  }
})

router.get('/trans/sales', async (req, res, next) => {
  try {
    const utcStartDate = new Date(req.query.dateRange.split('-')[0]).toUTCString()
    const endDate = req.query.dateRange.split('-')[1]
    const utcEndDate = new Date(endDate).toUTCString()

    const sales = await Purchase.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('trans_amount')), 'totalTransAmount'],
        [Sequelize.fn('SUM', Sequelize.col('`Product->Mask`.`unit_per_pack`')), 'totalMaskAmout']
      ],
      where: {
        transDate: { ...endDate ? { [Op.between]: [utcStartDate, utcEndDate] } : { [Op.gte]: utcStartDate } }
      },
      include: [{
        model: Product,
        attributes: [],
        include: [{
          model: Mask,
          attributes: []
        }]
      }]
    })

    res.status(200).json(sales)
  } catch (err) {
    next(err)
  }
})

router.get('/trans/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params
    const { productId } = req.query

    const result = await sequelize.transaction(async (t) => {
      const product = await Product.findOne({
        attributes: [
          'id',
          'pharmacyId',
          [Sequelize.col('Pharmacy.name'), 'pharmacyName'],
          [Sequelize.literal('CONCAT(`Mask`.name, \' (\', `Mask`.color, \') (\', `Mask`.unit_per_pack, \' per pack)\')'), 'maskName'],
          'price'
        ],
        where: {
          id: productId
        },
        include: [{
          model: Pharmacy,
          attributes: []
        }, {
          model: Mask,
          attributes: []
        }],
        raw: true
      })

      const newTransaction = await Purchase.create({
        userId,
        productId,
        transAmount: product.price,
        raw: true
      }, { transaction: t })

      await User.increment({ cashBalance: -newTransaction.transAmount }, { where: { id: userId } }, { transaction: t })
      await Pharmacy.increment({ cashBalance: newTransaction.transAmount }, { where: { id: product.pharmacyId } }, { transaction: t })

      const updatedUserCash = await User.findByPk(userId)
      const updatedPharmacyCash = await Pharmacy.findByPk(product.pharmacyId)

      const data = {
        newTransaction: {
          transactionId: newTransaction.id,
          userName: updatedUserCash.name,
          pharmacyName: product.pharmacyName,
          maskName: product.maskName,
          transAmount: newTransaction.transAmount,
          transDate: newTransaction.transDate
        },
        updatedUserCash: {
          userId: updatedUserCash.id,
          userName: updatedUserCash.name,
          cashBalance: updatedUserCash.cashBalance
        },
        updatedPharmacyCash: {
          pharmacyId: updatedPharmacyCash.id,
          pharmacyName: updatedPharmacyCash.name,
          cashBalance: updatedPharmacyCash.cashBalance
        }

      }
      return data
    })

    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
