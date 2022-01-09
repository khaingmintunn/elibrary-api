const express = require('express')
const router = express.Router()
const Model = require('../models')
const { ERROR } = require('../constant')
const { AUTH_ADMIN } = require('../utils/auth')

router.post('/category', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.Category.create(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.CATEGORY_CREATE })
  }
})

router.get('/category/:category_id', async (req, res) => {
  try {
    const result = await Model.Category.getCategory(req.params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.CATEGORY })
  }
})

router.get('/categories', async (req, res) => {
  try {
    const result = await Model.Category.getCategories(req.query)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.CATEGORY_LIST })
  }
})

router.put('/category/:category_id', AUTH_ADMIN, async (req, res) => {
  try {
    const params = { ...req.body, ...req.params }
    const result = await Model.Category.update(params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.CATEGORY_UPDATE })
  }
})

router.delete('/category/:category_id', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.Category.delete(req.params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.CATEGORY_CREATE })
  }
})

module.exports = router
