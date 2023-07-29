const express = require('express')
const router = express.Router()
const pharmacies = require('./pharmacies')
const users = require('./users')

router.use('/pharmacy', pharmacies)
router.use('/users', users)

module.exports = router
