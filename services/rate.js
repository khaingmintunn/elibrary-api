const express = require('express')
const router = express.Router()
const Model = require('../models')
const { ERROR } = require('../constant')
const { AUTH_USER } = require('../utils/auth')

router.get('/rates', AUTH_USER, async (req, res) => {
  try {
    const result = await Model.Rate.getRates(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.BOOK_CREATE })
  }
})

router.post('/rate', AUTH_USER, async (req, res) => {
  try {
    const result = await Model.Rate.create(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.BOOK_CREATE })
  }
})

module.exports = router
