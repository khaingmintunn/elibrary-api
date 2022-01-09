'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const UserSchema = require('../schemas').User
const UserValidation = require('../validations').User
const TokenModel = require('../models/token').TokenModel
const TokenSchema = require('../schemas').Token
const Util = require('../utils/util')
const {
  AUTH_STATUS,
  USER_TYPE,
  AVATAR,
  ERROR,
  TOKEN_TYPE,
} = require('../constant')
const Email = require('../utils/email')
const EmailBody = require('../utils/emailBody')

class UserModel {
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

  /***************************************************************************************************
   * Function
   ****************************************************************************************************/
  static async getUsers() {
    const result = await UserSchema.find()

    const users = []
    result.map((res) => {
      users.push(this.toModel(res))
    })

    return { users }
  }

  static async getUserById(params) {
    const user = await UserSchema.findOne({ user_id: params.user_id })

    return { user: this.toModel(user) }
  }

  static async create(params) {
    const error = UserValidation.create(params)
    if (error) return { error: { status: 400, message: error } }

    const exist_user = await this._getByEmail(params.email)
    if (exist_user)
      return { error: { status: 422, message: ERROR.USER_EXIST_MESSAGE } }
    const payload = await this.createUserPayload(params)
    const user_schema = UserSchema(payload)
    const user = await user_schema.save()

    return { user: this.toModel(user) }
  }

  static async updateProfile(params) {
    const error = UserValidation.updateProfile(params)
    if (error) return { error: { status: 400, message: error } }

    const exist_user = await this._getById(params.current_user.user_id)
    if (!exist_user)
      return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }
    const user = await this.update(
      {
        name: params.name,
        dob: params.dob,
        gender: params.gender,
        phone: params.phone,
        avatar: params.avatar,
      },
      exist_user
    )

    return { user: this.toModel(user) }
  }

  static async updateEmail(params) {
    const error = UserValidation.updateEmail(params)
    if (error) return { error: { status: 400, message: error } }

    if (params.current_user.email === params.email)
      return { error: { status: 412, message: ERROR.CURRENT_EMAIL_ERROR } }

    const user = await this._getByEmail(params.email)
    if (user && user?.auth_status !== AUTH_STATUS.NO_AUTH)
      return { error: { status: 412, message: ERROR.USER_EXIST_MESSAGE } }

    const token = await TokenModel.create(
      TOKEN_TYPE.EMAIL_UPDATE,
      params.current_user.user_id,
      { email: params.email }
    )
    if (!token)
      return { error: { status: 500, message: ERROR.INTERNAL_SERVER } }

    await Email.send({
      email: params.email,
      subject: 'E-library Email Updating',
      html: EmailBody.updateEmail({ name: params.current_user.name, ...token }),
    })

    return { message: `Signup success. Please check in ${params.email}.` }
  }

  static async confirmUpdateEmail(params) {
    const error = UserValidation.confirmUpdateEmail(params)
    if (error) return { error: { status: 400, message: error } }

    const token = await TokenSchema.findOne({
      token_id: params.token_id,
      type: TOKEN_TYPE.EMAIL_UPDATE,
    })
    if (!token) {
      return { error: { status: 404, message: ERROR.TOKEN_NOT_FOUND } }
    }
    if (token?.expired < moment().unix()) {
      return { error: { status: 403, message: ERROR.EXPIRED_MESSAGE } }
    }

    const user = await this._getById(token.user_id)
    if (user && user.auth_status !== AUTH_STATUS.AUTHED) {
      return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }
    }

    const result = await this.update({ email: token.email }, user)
    await TokenModel.deleteById(params.token_id)
    Email.send({
      email: user.email,
      subject: 'Success: Email Upating',
      html: EmailBody.signupConfirm({ name: user.name }),
    })

    return { user: this.toModel(result) }
  }

  static async updatePassword(params) {
    const error = UserValidation.updatePassword(params)
    if (error) return { error: { status: 400, message: error } }

    const user = await UserSchema.findOne({
      user_id: params.current_user.user_id,
    })
    const is_match = await Util.comparePassword(
      params.old_password,
      user.password
    )
    if (!is_match)
      return {
        error: { status: 406, message: ERROR.INCORRECT_CURRENT_PASSWORD },
      }

    const hashed_password = await Util.hashPassword(params.new_password)
    await this.update({ password: hashed_password }, user)
    Email.send({
      email: user.email,
      subject: 'Success: Changing password',
      html: EmailBody.updatePassword({ name: user.name }),
    })

    return { message: 'Password changing success.' }
  }

  static async updateUserType(params) {
    const error = UserValidation.updateRole(params)
    if (error) return { error: { status: 400, message: error } }

    const user = await this._getById(params.user_id)
    if (!user) return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }

    const result = await this.update({ user_type: params.user_type }, user)

    return { user: this.toModel(result) }
  }

  static async suspendUser(params) {
    const user = await this._getNoAuthedUserById(params.user_id)
    if (!user) return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }

    const auth_status =
      user.auth_status === AUTH_STATUS.SUSPENDED
        ? AUTH_STATUS.AUTHED
        : AUTH_STATUS.SUSPENDED
    const result = await this.update({ auth_status }, user)

    Email.send({
      email: user.email,
      subject:
        auth_status === AUTH_STATUS.SUSPENDED ? 'Suspended' : 'Unsuspended',
      html:
        auth_status === AUTH_STATUS.SUSPENDED
          ? EmailBody.suspend({ name: user.name })
          : EmailBody.unsuspend({ name: user.name }),
    })

    return { user: this.toModel(result) }
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
        user_type: params.user_type || user.user_type,
        updated: moment().unix(),
      },
      { new: true }
    )

    return this.toModel(updated_user)
  }

  static async deleteUserById(params) {
    const user = await this._getById(params.user_id)
    if (!user) return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }

    await UserSchema.findOneAndRemove({ user_id: params.user_id })

    return { message: `Deleted user: ${user.email} successfully.` }
  }

  /**************************************************************************************************
   * Query
   ***************************************************************************************************/
  static async _getAll() {
    const users = await UserSchema.find().sort({ updated: -1 })

    const user_list = []
    users.map((user) => {
      user_list.push(this.toModel(user))
    })

    return user_list
  }

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

  static async _getNoAuthedUserById(user_id) {
    const user = await UserSchema.findOne({
      user_id,
      auth_status: { $ne: AUTH_STATUS.NO_AUTH },
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

  static async _deleteById(user_id) {
    const user = await UserSchema.findOneAndDelete({ user_id })

    return user
  }

  /**************************************************************************************************
   * User Payload
   ***************************************************************************************************/
  static async createUserPayload(params) {
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
      auth_status: AUTH_STATUS.AUTHED,
      user_type: params.user_type || USER_TYPE.USER,
      created: moment().unix(),
      updated: moment().unix(),
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

    return new UserModel(user)
  }
}

module.exports.UserModel = UserModel
