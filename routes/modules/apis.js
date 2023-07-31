const express = require('express')
const router = express.Router()
const pharmacies = require('./pharmacies')
const users = require('./users')
const searching = require('./searching')

router.use('/pharmacies', pharmacies)
router.use('/users', users)
router.use('/searching', searching)

module.exports = router
