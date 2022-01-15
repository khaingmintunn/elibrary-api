const Token = require('../models').Token
const Auth = require('../models').Auth
const { USER_TYPE, TOKEN_TYPE, ERROR, AUTH_STATUS } = require('../constant')

exports.AUTH_ADMIN = async (req, res, next) => {
  const {
    headers: { authorization },
  } = req
  const token = await Token.getByIdAndType(authorization, TOKEN_TYPE.AUTH)
  const user = await Auth._getById(token?.user_id)
  if (user?.auth_status === AUTH_STATUS.SUSPENDED) {
    return res.status(401).send({ message: ERROR.USER_SUSPEND_MESSAGE })
  }
  if (!token || user?.auth_status !== AUTH_STATUS.AUTHED) {
    return res.status(401).send({ message: ERROR.NO_AUTH })
  }

  if (user?.user_type !== USER_TYPE.ADMIN) {
    return res.status(405).send({ message: ERROR.PERMISSION })
  }
  req.body.current_user = user
  next()
}

exports.AUTH_USER = async (req, res, next) => {
  const {
    headers: { authorization },
  } = req
  const token = await Token.getByIdAndType(authorization, TOKEN_TYPE.AUTH)
  const user = await Auth._getById(token?.user_id)
  if (user?.auth_status === AUTH_STATUS.SUSPENDED) {
    return res.status(401).send({ message: ERROR.USER_SUSPEND_MESSAGE })
  }
  if (!token || user?.auth_status !== AUTH_STATUS.AUTHED) {
    return res.status(401).send({ message: ERROR.NO_AUTH })
  }

  if (
    user?.user_type !== USER_TYPE.USER &&
    user?.user_type !== USER_TYPE.PREMIUM_USER
  ) {
    return res.status(405).send({ message: ERROR.PERMISSION })
  }
  req.body.current_user = user
  next()
}

exports.AUTH_PREMIUM_USER = async (req, res, next) => {
  const {
    headers: { authorization },
  } = req
  const token = await Token.getByIdAndType(authorization, TOKEN_TYPE.AUTH)
  const user = await Auth._getById(token?.user_id)
  if (user?.auth_status === AUTH_STATUS.SUSPENDED) {
    return res.status(401).send({ message: ERROR.USER_SUSPEND_MESSAGE })
  }
  if (!token || user?.auth_status !== AUTH_STATUS.AUTHED) {
    return res.status(401).send({ message: ERROR.NO_AUTH })
  }

  if (user?.user_type !== USER_TYPE.PREMIUM_USER) {
    return res.status(405).send({ message: ERROR.PERMISSION })
  }
  req.body.current_user = user
  next()
}

exports.AUTH_SUPER_ADMIN = async (req, res, next) => {
  const {
    headers: { authorization },
  } = req
  const token = await Token.getByIdAndType(authorization, TOKEN_TYPE.AUTH)
  const user = await Auth._getById(token?.user_id)
  if (user?.auth_status === AUTH_STATUS.SUSPENDED) {
    return res.status(401).send({ message: ERROR.USER_SUSPEND_MESSAGE })
  }
  if (!token || user?.auth_status !== AUTH_STATUS.AUTHED) {
    return res.status(401).send({ message: ERROR.NO_AUTH })
  }

  if (user?.user_type !== USER_TYPE.SUPER_ADMIN) {
    return res.status(405).send({ message: ERROR.PERMISSION })
  }
  req.body.current_user = user
  next()
}

exports.AUTHED = async (req, res, next) => {
  const {
    headers: { authorization },
  } = req
  const token = await Token.getByIdAndType(authorization, TOKEN_TYPE.AUTH)
  const user = await Auth._getById(token?.user_id)
  if (user?.auth_status === AUTH_STATUS.SUSPENDED) {
    return res.status(401).send({ message: ERROR.USER_SUSPEND_MESSAGE })
  }
  if (!token || user?.auth_status !== AUTH_STATUS.AUTHED) {
    return res.status(401).send({ message: ERROR.NO_AUTH })
  }
  req.body.current_user = user
  next()
}
