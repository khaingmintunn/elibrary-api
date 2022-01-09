'use strict'

const bcrypt = require('bcrypt-nodejs')

class Util {
  /**
   * Generate Random String
   * @param {Number} len - string length
   * @returns random string
   */
  static randomString(len) {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const cl = chars.length

    let str = ''
    for (let i = 0; i < len; i++) {
      str += chars[Math.floor(Math.random() * cl)]
    }

    return str
  }

  /**
   * Generate Hashed Password
   * @param {String} password - password string
   * @returns hashed password
   */
  static async hashPassword(password) {
    const saltRounds = bcrypt.genSaltSync(10)

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, null, (error, hash) => {
        if (error) reject(error)
        resolve(hash)
      })
    })

    return hashedPassword
  }

  /**
   * Compare password and hashed password
   * @param {String} password - password string
   * @param {String} existPassword - hashed password
   * @returns {Boolean}
   */
  static async comparePassword(password, existPassword) {
    const isMatch = await new Promise((resolve, reject) => {
      bcrypt.compare(password, existPassword, (error, isMatch) => {
        if (error) reject(error)
        resolve(isMatch)
      })
    })

    return isMatch
  }
}

module.exports = Util
