const express = require('express')
const router = express.Router()
const Model = require('../models')
const { ERROR } = require('../constant')
const { AUTH_SUPER_ADMIN, AUTHED } = require('../utils/auth')

router.get('/users', AUTH_SUPER_ADMIN, async (req, res) => {
  try {
    const result = await Model.User.getUsers(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER_LIST })
  }
})

router.get('/user/:user_id', AUTH_SUPER_ADMIN, async (req, res) => {
  try {
    const result = await Model.User.getUserById(req.params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER })
  }
})

router.get('/me', AUTHED, async (req, res) => {
  try {
    return res
      .status(200)
      .send({ user: Model.User.toModel(req.body.current_user) })
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER })
  }
})

router.post('/user', AUTH_SUPER_ADMIN, async (req, res) => {
  try {
    const result = await Model.User.create(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER_CREATE })
  }
})

router.put('/me', AUTHED, async (req, res) => {
  try {
    const result = await Model.User.updateProfile(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER_UPDATE })
  }
})

router.put('/user/email', AUTHED, async (req, res) => {
  try {
    const result = await Model.User.updateEmail(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.EMAIL_UPDATE })
  }
})

router.post('/user/email-confirm', AUTHED, async (req, res) => {
  try {
    const result = await Model.User.confirmUpdateEmail(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.EMAIL_UPDATE_CONFIRM })
  }
})

router.put('/user/password', AUTHED, async (req, res) => {
  try {
    const result = await Model.User.updatePassword(req.body)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.PASSWORD_UPDATE })
  }
})

router.put('/user/:user_id/role', AUTH_SUPER_ADMIN, async (req, res) => {
  try {
    const params = { ...req.body, ...req.params }
    const result = await Model.User.updateUserType(params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.PASSWORD_UPDATE })
  }
})

router.put('/user/:user_id/suspend', AUTH_SUPER_ADMIN, async (req, res) => {
  try {
    const result = await Model.User.suspendUser(req.params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.PASSWORD_UPDATE })
  }
})

router.delete('/user/:user_id', AUTH_SUPER_ADMIN, async (req, res) => {
  try {
    const result = await Model.User.deleteUserById(req.params)
    if (result?.error)
      return res
        .status(result.error.status)
        .send({ message: result.error.message })

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER })
  }
})
module.exports = router
