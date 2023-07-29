const express = require('express')
const router = express.Router()
const { User, Purchase } = require('../../models')
const { Op, Sequelize } = require('sequelize')

router.get('/trans', async (req, res) => {
  try {
    const defaultTop = 5
    const top = Number(req.query.top) || defaultTop
    const utcStartDate = new Date(req.query.dateRange.split('-')[0]).toUTCString()
    const endDate = req.query.dateRange.split('-')[1]
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
    console.log(err)
  }
})

module.exports = router
