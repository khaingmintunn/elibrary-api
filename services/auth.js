const express = require('express')
const router = express.Router()
const Model = require('../models')
const { ERROR } = require('../constant')
const { AUTHED } = require('../utils/auth')

router.post('/signup', async (req, res) => {
  try {
    const result = await Model.Auth.signup(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.SIGNUP })
  }
})

router.post('/signup-confirm', async (req, res) => {
  try {
    const result = await Model.Auth.signupConfirm(req.body)
    if (result.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.SIGNUP_CONFIRM })
  }
})

router.post('/forget-password', async (req, res) => {
  try {
    const result = await Model.Auth.forgetPassword(req.body)
    if (result.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.FORGET_PASSWORD })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const result = await Model.Auth.resetPassword(req.body)
    if (result.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.RESET_PASSWORD })
  }
})

router.post('/login', async (req, res) => {
  try {
    const result = await Model.Auth.login(req.body)
    if (result.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.LOGIN })
  }
})

router.post('/logout', AUTHED, async (req, res) => {
  try {
    const {
      headers: { authorization },
    } = req
    const result = await Model.Auth.logout(authorization)

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.LOGOUT })
  }
})
module.exports = router
