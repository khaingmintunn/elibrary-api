'use strict'

const validator = require('validator')

class CustomValidator {
  constructor() {}

  /********************************************************
   * Validation
   ********************************************************/
  /**
   * Require validation
   * @param {String} field - field name
   * @param {String} str - value
   * @returns error message
   */
  static isRequired(field, str) {
    if (str) return null
    let message = null
    if (!str || str == 'null' || str == null || str == undefined) {
      message = `${field} is required.`
    }

    return message
  }

  static isNumber(field, str) {
    if (!str) return null
    let message = null
    if (typeof str !== 'number') {
      message = `${field} must be number.`
    }

    return message
  }

  /**
   * Equal Validation
   * @param {String} field1 - field name
   * @param {String} field2 - field name
   * @param {String} str1 - value1
   * @param {String} str2 - value2
   * @returns error message
   */
  static isEqual(field1, field2, str1, str2) {
    if (!str1 || !str2) return null
    let message = null
    if (!validator.equals(str1, str2)) {
      message = `${field1} and ${field2} is not match.`
    }

    return message
  }

  /**
   * Contain Validation
   * @param {String} field1 - field name
   * @param {String} field2 - field name
   * @param {String} str1 - value1
   * @param {String} arr - array
   * @returns error message
   */
  static isInclude(field, str, arr) {
    if (!str) return null
    let message = null
    if (!arr.includes(str)) {
      message = `Invalid ${field}.`
    }

    return message
  }

  /**
   * Length Validation
   * @param {String} field - field name
   * @param {String} str - value
   * @param {Number} min - minimun length
   * @param {Number} max - maximun length
   * @returns error message
   */
  static validateLength(field, str, min, max) {
    if (!str) return null
    let message = null
    if (str.length < min || str.length > max) {
      message = `${field} lenght must be between ${min} and ${max}.`
    }

    return message
  }

  /**
   * Email Validation
   * @param {String} field - field name
   * @param {String} email - email address
   * @returns error message
   */
  static isEmail(field, email) {
    if (!email) return null
    let message = null
    if (!validator.isEmail(email)) {
      message = `${field} must be email format.`
    }

    return message
  }

  static isMobilePhone(field, phone) {
    if (!phone) return null
    let message = null
    if (!validator.isMobilePhone(phone)) {
      message = `Invalid ${field} number.`
    }

    return message
  }

  static validateArrayLength(field, array, max) {
    if (!array) return null
    let message = null
    if (array.length > max) {
      message = `${field} lenght must be maximum ${max}.`
    }

    return message
  }
}

module.exports.CustomValidator = CustomValidator
