const express = require('express')
const router = express.Router()
const { User, Pharmacy, Purchase, Product, Mask, sequelize } = require('../../models')
const { Op, Sequelize } = require('sequelize')

router.get('/trans/userTopList', async (req, res, next) => {
  try {
    const defaultTop = 5
    const top = Number(req.query.top) || defaultTop
    const startDate = req.query.dateRange?.split('-')[0] || '2000/01/01'
    const utcStartDate = new Date(startDate).toUTCString()
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

router.get('/trans/totalAmount', async (req, res, next) => {
  try {
    const startDate = req.query.dateRange?.split('-')[0] || '2000/01/01'
    const utcStartDate = new Date(startDate).toUTCString()
    const endDate = req.query.dateRange?.split('-')[1]
    const utcEndDate = new Date(endDate).toUTCString()

    const totalAmount = await Purchase.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('trans_amount')), 'totalTransAmount'],
        [Sequelize.fn('SUM', Sequelize.col('`Product->Mask`.`unit_per_pack`')), 'totalMaskAmount']
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

    res.status(200).json(...totalAmount)
  } catch (err) {
    next(err)
  }
})

router.post('/:userId/trans', async (req, res, next) => {
  try {
    const { userId } = req.params
    const { productId } = req.body
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
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users API
 * /users/trans/userTopList:
 *   get:
 *     summary: Get the top x users by total transaction amount of masks within a date range.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: top
 *         description: The number of user to return
 *         schema:
 *            type: integer
 *         required: true
  *       - in: query
 *         name: dateRange
 *         description: The date range \[yyyy/mm/dd-yyyy/mm/dd\]
 *         schema:
 *            type: string
 *            format: date
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/topUserList'
 *       500:
 *         description: Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failCase'
 *
 * /users/trans/totalAmount:
 *   get:
 *     summary: The total amount of masks and dollar value of transactions within a date range.
 *     tags: [Users]
 *     parameters:
  *       - in: query
 *         name: dateRange
 *         description: The date range \[yyyy/mm/dd-yyyy/mm/dd\]
 *         schema:
 *            type: string
 *            format: date
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/totalAmount'
 *       500:
 *         description: Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failCase'
 *
 *
 * /users/{userId}/trans:
 *   post:
 *     summary: Process a user purchases a mask from a pharmacy, and handle all relevant data changes in an atomic transaction.
 *     tags: [Users]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: integer
 *              required:
 *               - productId
 *              example:
 *                productId: 1
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The id of user
 *         schema:
 *            type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/transaction'
 *       500:
 *         description: Fail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failCase'
 *
 */
