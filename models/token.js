'use strict'

const moment = require('moment')
const TokenSchema = require('../schemas').Token
const Util = require('../utils/util')
const { TOKEN_TYPE } = require('../constant')

class TokenModel {
  constructor(params) {
    this.token_id = params.token_id
    this.type = params.type
    this.expired = params.expired
    this.user_id = params.user_id
    this.created = params.created
    this.updated = params.updated
  }

  static async create(type, user_id, params) {
    const payload = this.tokenPayload(type, user_id, params)
    const token_schema = TokenSchema(payload)
    const token = await token_schema.save()

    return this.toModel(token)
  }

  static async getByIdAndType(token_id, type) {
    const token = await TokenSchema.findOne({ token_id, type })

    return this.toModel(token)
  }

  static async deleteById(token_id) {
    const token = await TokenSchema.findOneAndDelete({ token_id })

    return this.toModel(token)
  }

  /**************************************************************************************************
   * User Payload
   ***************************************************************************************************/
  static tokenPayload(type, user_id, params) {
    const token = {
      token_id:
        type === TOKEN_TYPE.AUTH
          ? Util.randomString(40)
          : Util.randomString(20),
      type: type,
      email: params?.email || null,
      user_id: user_id,
      created: moment().unix(),
    }

    switch (type) {
      case TOKEN_TYPE.SIGNUP:
        token['expired'] = moment().add(1, 'hour').unix()
        break
      case TOKEN_TYPE.PASSWORD_RESET:
        token['expired'] = moment().add(1, 'hour').unix()
        break
      case TOKEN_TYPE.AUTH:
        token['expired'] = moment().add(1, 'month').unix()
        break
      case TOKEN_TYPE.EMAIL_UPDATE:
        token['expired'] = moment().add(1, 'hour').unix()
        break
    }

    return token
  }

  /***************************************************************************************************
   * Model
   ****************************************************************************************************/
  static toModel(params) {
    if (!params) return null

    const token = {
      token_id: params.token_id !== undefined ? params.token_id : null,
      type: params.type !== undefined ? params.type : null,
      expired: params.expired !== undefined ? params.expired : null,
      user_id: params.user_id !== undefined ? params.user_id : null,
      created: params.created !== undefined ? params.created : null,
      updated: params.updated !== undefined ? params.updated : null,
    }

    return new TokenModel(token)
  }
}

module.exports.TokenModel = TokenModel
