const express = require('express')
const router = express.Router()
const apis = require('./modules/apis')
const { errorHandler } = require('../error-handler')

router.use('/api/v1', apis)
router.use('/', errorHandler)

module.exports = router
