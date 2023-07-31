const express = require('express')
const router = express.Router()
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const options = require('../../swagger-doc')

const specs = swaggerJsdoc(options)
router.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
)

module.exports = router

/**
 * @swagger
 * components:
 *   schemas:
 *     failCase:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Default Internal Server Error
 *         type:
 *           type: string
 *           description: Name of err
 *         message:
 *           type: string
 *           description: detail err message
 *       example:
 *           status: Internal Server Error
 *           type: Error name
 *           message: Error message
 *
 *     search:
 *       type: array
 *       properties:
 *         userId:
 *           type: integer
 *           description: The id of user
 *         userName:
 *           type: string
 *           description: The name of user
 *         totalTransAmount:
 *           type: number
 *           description: Total spending amount during the given period
 *       example:
 *         - userId: "11"
 *           userName: "Ismael Cole"
 *           totalTransAmount: "31.57"
 *         - userId: "3"
 *           userName: "Geneva Floyd"
 *           totalTransAmount: "163.01"
 *
 *     topUserList:
 *       type: array
 *       properties:
 *         userId:
 *           type: integer
 *           description: The id of user
 *         userName:
 *           type: string
 *           description: The name of user
 *         totalTransAmount:
 *           type: number
 *           description: Total spending amount during the given period
 *       example:
 *         - userId: "11"
 *           userName: "Ismael Cole"
 *           totalTransAmount: "31.57"
 *         - userId: "3"
 *           userName: "Geneva Floyd"
 *           totalTransAmount: "163.01"
 *
 *     totalAmount:
 *       type: object
 *       properties:
 *         totalTransAmount:
 *           type: number
 *           description: The total spending amount during given period
 *         totalMasksAmount:
 *           type: number
 *           description: The total selling amount of mask during given period
 *       example:
 *           totalTransAmount: "97.27"
 *           totalMaskAmount: "36"
 *
 *     openingHours:
 *       type: array
 *       properties:
 *         pharmacyName:
 *           type: string
 *           description: The name of pharmacy
 *         dayOfWeek:
 *           type: integer
 *           description: The day of week \[Mon, Tue, Wed, Thur, Fir, Sat, Sun\]
 *         openHour:
 *           type: string
 *           description: The opening time of the pharmacy
 *         closeHour:
 *           type: string
 *           description: The closing time of the pharmacy
 *       example:
 *         - pharmacyName: 'Carepoint'
 *           dayOfWeek: 'Mon'
 *           openHour: "08:00:00"
 *           closeHour: "17:00:00"
 *         - pharmacyName: 'First Care Rx'
 *           dayOfWeek: 'Mon'
 *           openHour: "08:00:00"
 *           closeHour: "17:00:00"
 *
 *     stocks:
 *       type: array
 *       properties:
 *         Higher:
 *           type: array
 *           description: more than x masks within given priceRange
 *           properties:
 *             pharmacyId:
 *               type: integer
 *               description: The id of the pharmacy
 *             pharmacyName:
 *               type: string
 *               description: The name of the pharmacy
 *             Product:
 *               type: array
 *               description: The mask list of the pharmacy
 *               properties:
 *                 maskName:
 *                   type: string
 *                   description: The name of the mask
 *                 price:
 *                   type: number
 *                   description: The selling price of the mask
 *         Lower:
 *           type: array
 *           description: more than x masks within given priceRange
 *           properties:
 *             pharmacyId:
 *               type: integer
 *               description: The id of the pharmacy
 *             pharmacyName:
 *               type: string
 *               description: The name of the pharmacy
 *             Product:
 *               type: array
 *               description: The mask list of the pharmacy
 *               properties:
 *                 maskName:
 *                   type: string
 *                   description: The name of the mask
 *                 price:
 *                   type: number
 *                   description: The selling price of the mask
 *       example:
 *         Higher:
 *           - pharmacyId: "1"
 *             pharmacyName: "DFW Wellness"
 *             Product:
 *               - maskName: "True Barrier (green) (3 per pack)"
 *                 price: "13.70"
 *               - maskName: "Second Smile (black) (3 per pack)"
 *                 price: "5.84"
 *           - pharmacyId: "3"
 *             pharmacyName: "First Care Rx"
 *             Products:
 *               - maskName: "Second Smile (green) (6 per pack)"
 *                 price: "27.69"
 *               - maskName: "Second Smile (blue) (6 per pack)"
 *                 price: "11.07"
 *         Lower:
 *           - pharmacyId: "2"
 *             pharmacyName: "Carepoint"
 *             Product:
 *               - maskName: "Masquerade (blue) (6 per pack)"
 *                 price: "7.05"
 *
 *     masks:
 *       type: array
 *       properties:
 *         maskName:
 *           type: string
 *           description: The name of the mask
 *         price:
 *           type: number
 *           description: The price of the mask
 *       example:
 *         - maskName: "Second Smile (black) (3 per pack)"
 *           price: "5.84"
 *         - maskName: "Masquerade (green) (3 per pack)"
 *           price: "9.40"
 *
 *     transaction:
 *       type: object
 *       properties:
 *         newTransaction:
 *           type: object
 *           properties:
 *            transactionId:
 *              type: integer
 *              description: The auto-generated id of of the transaction
 *            userName:
 *              type: string
 *              description: The name of the user in the transaction
 *            pharmacyName:
 *              type: string
 *              description: The name of the pharmacy in the transaction
 *            maskName:
 *              type: string
 *              description: The name of the mask in the transaction
 *            transAmount:
 *              type: number
 *              description: The spending amount of the transaction
 *         updatedUserCash:
 *           type: object
 *           properties:
 *            userId:
 *              type: integer
 *              description: The id of user in the transaction
 *            userName:
 *              type: string
 *              description: The name of user in the transaction
 *            cashBalance:
 *              type: number
 *              description: The amount of money pharmacy holds in merchant account
 *         updatedPharmacyCash:
 *           type: object
 *           properties:
 *            pharmacyId:
 *              type: integer
 *              description: The id of pharmacy in the transaction
 *            pharmacyName:
 *              type: string
 *              description: The name of pharmacy in the transaction
 *            cashBalance:
 *              type: number
 *           description: The amount of money pharmacy holds in merchant account
 *       example:
 *          newTransaction:
 *            transactionId: "103"
 *            userName: "Yvonne Guerrero"
 *            pharmacyName: "DFW Wellness"
 *            maskName: "True Barrier (green) (3 per pack)"
 *            transAmount: "13.70"
 *          updatedUserCash:
 *            userId: "1"
 *            userName: "Yvonne Guerrero"
 *            cashBalance: "150.73"
 *          updatedPharmacyCash:
 *            pharmacyId: "1"
 *            pharmacyName: "DFW Wellness"
 *            cashBalance: "369.51"
 *
 */
