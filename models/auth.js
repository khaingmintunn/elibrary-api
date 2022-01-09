'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const Util = require('../utils/util')
const AuthValidation = require('../validations').Auth
const UserSchema = require('../schemas').User
const TokenModel = require('../models/token').TokenModel
const {
  AUTH_STATUS,
  USER_TYPE,
  AVATAR,
  TOKEN_TYPE,
  ERROR,
} = require('../constant')
const Email = require('../utils/email')
const EmailBody = require('../utils/emailBody')
const UserModel = require('../models/user').UserModel

class AuthModel {
  constructor(params) {
    this.user_id = params.user_id
    this.name = params.name
    this.email = params.email
    this.password = params.password
    this.dob = params.dob
    this.gender = params.gender
    this.address = params.address
    this.phone = params.phone
    this.avatar = params.avatar
    this.auth_status = params.auth_status
    this.user_type = params.user_type
    this.created = params.created
    this.updated = params.updated
  }

  /**************************************************************************************************
   * Functions
   ***************************************************************************************************/
  static async signup(params) {
    const error = AuthValidation.signup(params)
    if (error) return { error: { status: 400, message: error } }

    const exist_user = await this._getByEmail(params.email)
    if (exist_user?.auth_status === AUTH_STATUS.AUTHED) {
      return { error: { status: 422, message: ERROR.USER_EXIST_MESSAGE } }
    }
    if (exist_user?.auth_status === AUTH_STATUS.SUSPENDED) {
      return { error: { status: 401, message: ERROR.USER_SUSPEND_MESSAGE } }
    }

    let user
    const payload = await this.userPayload(params)
    if (exist_user) {
      user = await this.update(payload, exist_user)
    } else {
      const user_schema = UserSchema(payload)
      user = await user_schema.save()
    }

    if (!user) return { error: { status: 500, message: ERROR.INTERNAL_SERVER } }
    const token = await TokenModel.create(TOKEN_TYPE.SIGNUP, user.user_id)

    if (!token)
      return { error: { status: 500, message: ERROR.INTERNAL_SERVER } }

    await Email.send({
      email: params.email,
      subject: 'E-library Signup Confirmation',
      html: EmailBody.signup({ name: user.name, ...token }),
    })

    return { message: `Signup success. Please check in ${params.email}.` }
  }

  static async signupConfirm(params) {
    const error = AuthValidation.signupConfirm(params)
    if (error) return { error: { status: 400, message: error } }

    const token = await TokenModel.getByIdAndType(
      params.token_id,
      TOKEN_TYPE.SIGNUP
    )
    if (!token) {
      return { error: { status: 401, message: ERROR.TOKEN_NOT_FOUND } }
    }
    if (token?.expired < moment().unix()) {
      return { error: { status: 403, message: ERROR.EXPIRED_MESSAGE } }
    }

    const user = await this._getById(token.user_id)
    if (user && user.auth_status !== AUTH_STATUS.NO_AUTH) {
      return { error: { status: 422, message: ERROR.USER_EXIST_MESSAGE } }
    }

    await this.update({ auth_status: AUTH_STATUS.AUTHED }, user)
    await TokenModel.deleteById(params.token_id)
    Email.send({
      email: user.email,
      subject: 'Congratulation New User',
      html: EmailBody.signupConfirm({ name: user.name }),
    })

    return { message: 'Signup success.' }
  }

  static async forgetPassword(params) {
    const error = AuthValidation.forgetPassword(params)
    if (error) return { error: { status: 400, message: error } }

    const user = await this._getAuthedUserByEmail(params.email)
    if (!user) return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }

    const token = await TokenModel.create(
      TOKEN_TYPE.PASSWORD_RESET,
      user.user_id
    )
    await Email.send({
      email: params.email,
      subject: 'Elibrary Forget Password',
      html: EmailBody.forgetPassword({ name: user.name, ...token }),
    })

    return {
      message: `Forget password success. Please check in ${params.email}`,
    }
  }

  static async resetPassword(params) {
    const error = AuthValidation.resetPassword(params)
    if (error) return { error: { status: 400, message: error } }

    const token = await TokenModel.getByIdAndType(
      params.token_id,
      TOKEN_TYPE.PASSWORD_RESET
    )
    if (!token) {
      return { error: { status: 403, message: ERROR.TOKEN_NOT_FOUND } }
    }
    if (token && token.expired < moment().unix()) {
      return { error: { status: 403, message: ERROR.EXPIRED_MESSAGE } }
    }

    const user = await this._getById(token.user_id)
    const hashed_password = await Util.hashPassword(params.password)
    await this.update({ password: hashed_password }, user)
    await TokenModel.deleteById(params.token_id)
    Email.send({
      email: user.email,
      subject: 'Success: Password Reset',
      html: EmailBody.resetPassword({ name: user.name }),
    })

    return { message: 'Reset password success.' }
  }

  static async login(params) {
    const error = AuthValidation.login(params)
    if (error) return { error: { status: 400, message: error } }

    const user = await this._getByEmail(params.email)
    if (!user) return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }
    else if (user && user.auth_status === AUTH_STATUS.NO_AUTH)
      return { error: { status: 401, message: ERROR.NEED_AUTH } }
    else if (user && user.auth_status === AUTH_STATUS.SUSPENDED)
      return { error: { status: 401, message: ERROR.USER_SUSPEND_MESSAGE } }

    const is_match = await Util.comparePassword(params.password, user.password)
    if (!is_match)
      return { error: { status: 422, message: ERROR.INCORRECT_PASSWORD } }
    const token = await TokenModel.create(TOKEN_TYPE.AUTH, user.user_id, params)

    return {
      token: token.token_id,
      user: UserModel.toModel(user),
    }
  }

  static async logout(token_id) {
    await TokenModel.deleteById(token_id)

    return { message: 'Logout Success' }
  }

  static async update(params, user) {
    const updated_user = await UserSchema.findOneAndUpdate(
      { user_id: user.user_id },
      {
        name: params.name || user.name,
        email: params.email || user.email,
        password: params.password || user.password,
        dob: params.dob || user.dob,
        gender: params.gender || user.gender,
        phone: params.phone || user.phone,
        avatar: params.avatar || user.avatar,
        auth_status: params.auth_status || user.auth_status,
        updated: moment().unix(),
      },
      { new: true }
    )

    return this.toModel(updated_user)
  }

  /**************************************************************************************************
   * Query
   ***************************************************************************************************/
  static async _getByEmail(email) {
    const user = await UserSchema.findOne({ email })

    return this.toModel(user)
  }

  static async _getById(user_id) {
    const user = await UserSchema.findOne({ user_id })

    return this.toModel(user)
  }

  static async _getAuthedUserById(user_id) {
    const user = await UserSchema.findOne({
      user_id,
      auth_status: AUTH_STATUS.AUTHED,
    })

    return this.toModel(user)
  }

  static async _getAuthedUserByEmail(email) {
    const user = await UserSchema.findOne({
      email,
      auth_status: AUTH_STATUS.AUTHED,
    })

    return this.toModel(user)
  }

  /**************************************************************************************************
   * User Payload
   ***************************************************************************************************/
  static async userPayload(params) {
    const hashed_password = await Util.hashPassword(params.password)

    return {
      user_id: uuidv4(),
      name: params.name,
      email: params.email,
      password: hashed_password,
      dob: params.dob,
      gender: params.gender,
      address: params.address,
      phone: params.phone,
      avatar: params.avatar || AVATAR,
      auth_status: AUTH_STATUS.NO_AUTH,
      user_type: USER_TYPE.USER,
      created: moment().unix(),
    }
  }

  /***************************************************************************************************
   * Model
   ****************************************************************************************************/
  static toModel(params) {
    if (!params) return null

    const user = {
      user_id: params.user_id !== undefined ? params.user_id : null,
      name: params.name !== undefined ? params.name : null,
      email: params.email !== undefined ? params.email : null,
      password: params.password !== undefined ? params.password : null,
      dob: params.dob !== undefined ? params.dob : null,
      gender: params.gender !== undefined ? params.gender : null,
      address: params.address !== undefined ? params.address : null,
      phone: params.phone !== undefined ? params.phone : null,
      avatar: params.avatar !== undefined ? params.avatar : null,
      auth_status: params.auth_status !== undefined ? params.auth_status : null,
      user_type: params.user_type !== undefined ? params.user_type : null,
      created: params.created !== undefined ? params.created : null,
      updated: params.updated !== undefined ? params.updated : null,
    }

    return new AuthModel(user)
  }
}

module.exports.AuthModel = AuthModel
