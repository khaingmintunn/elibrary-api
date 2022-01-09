const express = require('express')
const router = express.Router()
const Model = require('../models')
const { ERROR } = require('../constant')
const { AUTH_ADMIN } = require('../utils/auth')

router.get('/books', async (req, res) => {
  try {
    const result = await Model.Book.getBooks(req.query)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.BOOK_LIST })
  }
})

router.get('/book/list', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.Book._getAll()
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send({ books: result })
  } catch (error) {
    return res.status(500).send({ message: ERROR.BOOK_LIST })
  }
})

router.get('/book/:book_id', async (req, res) => {
  try {
    const result = await Model.Book.getBookById(req.params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.BOOK })
  }
})

router.post('/book', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.Book.create(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.BOOK_CREATE })
  }
})

router.put('/book/:book_id', AUTH_ADMIN, async (req, res) => {
  try {
    const params = { ...req.body, ...req.params }
    const result = await Model.Book.update(params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.BOOK_CREATE })
  }
})

router.delete('/book/:book_id', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.Book.delete(req.params)
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
