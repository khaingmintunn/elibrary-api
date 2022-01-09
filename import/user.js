const fs = require('fs')
const uuidv4 = require('uuid').v4
const moment = require('moment')
const filePath = './import/statics/users.json'
const items = fs.readFileSync(filePath)
const rawItems = JSON.parse(items)
const UserSchema = require('../schemas').User
const Util = require('../utils/util')

class UserImport {
  static async import() {
    const messages = []
    await Promise.all(
      rawItems.map(async (rawItem) => {
        messages.push(await this.importStaticData(rawItem))
      })
    )
    const result = messages.filter((message) => {
      return message !== null
    })

    return result
  }

  static async importStaticData(user) {
    const exist_user = await UserSchema.findOne({ email: user.email })
    if (exist_user) return null
    const payload = await this.userPayload(user)
    const schema = UserSchema(payload)
    const result = await schema.save()
    return result ? `${result.name} is added.` : null
  }

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
      avatar: params.avatar,
      auth_status: params.auth_status,
      user_type: params.user_type,
      created: moment().unix(),
      updated: moment().unix(),
    }
  }
}

module.exports = UserImport
