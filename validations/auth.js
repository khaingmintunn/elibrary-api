'use strict'

const validator = require('../utils/validator').CustomValidator
const { GENDER } = require('../constant')

class AuthValidation {
  static signup(params) {
    const messages = [
      validator.isRequired('name', params.name),
      validator.isRequired('email', params.email),
      validator.isRequired('password', params.password),
      validator.isRequired('dob', params.dob),
      validator.isRequired('gender', params.gender),
      validator.isRequired('address', params.address),
      validator.isRequired('phone', params.phone),
      validator.validateLength('name', params.name, 4, 30),
      validator.isEmail('email', params.email),
      validator.validateLength('password', params.password, 6, 30),
      validator.isNumber('dob', params.dob),
      validator.isInclude('gender', params.gender, [
        GENDER.MALE,
        GENDER.FEMALE,
      ]),
      validator.isMobilePhone('phone', params.phone),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static signupConfirm(params) {
    const messages = [validator.isRequired('token_id', params.token_id)]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static forgetPassword(params) {
    const messages = [
      validator.isRequired('email', params.email),
      validator.isEmail('email', params.email),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static resetPassword(params) {
    const messages = [
      validator.isRequired('token_id', params.token_id),
      validator.isRequired('password', params.password),
      validator.isRequired('confirm_password', params.confirm_password),
      validator.isEqual(
        'password',
        'confirm_password',
        params.password,
        params.confirm_password
      ),
      validator.validateLength('password', params.password, 6, 30),
      validator.validateLength(
        'confirm_password',
        params.confirm_password,
        6,
        30
      ),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static login(params) {
    const messages = [
      validator.isRequired('email', params.email),
      validator.isRequired('password', params.password),
      validator.isEmail('email', params.email),
      validator.validateLength('password', params.password, 6, 30),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }
}

module.exports.AuthValidation = AuthValidation
