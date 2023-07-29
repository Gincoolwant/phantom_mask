const express = require('express')
const router = express.Router()
const apis = require('./modules/apis')

router.use('/api/v1', apis)
// router.use('/', errorHandler)

module.exports = router
