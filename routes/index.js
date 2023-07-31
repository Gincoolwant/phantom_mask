const express = require('express')
const router = express.Router()
const apis = require('./modules/apis')
const { errorHandler } = require('../helper/error-handler')
const swagger = require('./modules/swagger')

router.use('/api/v1', apis)
router.use('/api-docs', swagger)
router.use('/', errorHandler)

module.exports = router
