const express = require('express')
const router = express.Router()
const auth = require('./auth')
const user = require('./user')
const category = require('./category')
const book = require('./book')
const rate = require('./rate')

router.use('/', auth)
router.use('/', user)
router.use('/', category)
router.use('/', book)
router.use('/', rate)

module.exports = router
