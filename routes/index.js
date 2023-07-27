const express = require('express')
const router = express.Router()

router.use('/api/v1', apis)
router.use('/', errorHandler)

module.exports = router
