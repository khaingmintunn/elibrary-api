const express = require('express')
const router = express.Router()
const auth = require('./auth')
const user = require('./user')
const category = require('./category')
const book = require('./book')

router.use('/', auth)
router.use('/', user)
router.use('/', category)
router.use('/', book)

module.exports = router
