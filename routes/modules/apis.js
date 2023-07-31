const express = require('express')
const router = express.Router()
const pharmacies = require('./pharmacies')
const users = require('./users')
const search = require('./search')

router.use('/pharmacies', pharmacies)
router.use('/users', users)
router.use('/search', search)

module.exports = router
