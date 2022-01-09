'use strict'

const validator = require('../utils/validator').CustomValidator
const { GENDER, USER_TYPE } = require('../constant')

class UserValidation {
  static create(params) {
    const messages = [
      validator.isRequired('name', params.name),
      validator.isRequired('email', params.email),
      validator.isRequired('password', params.password),
      validator.isRequired('dob', params.dob),
      validator.isRequired('gender', params.gender),
      validator.isRequired('address', params.address),
      validator.isRequired('phone', params.phone),
      validator.isRequired('user_type', params.user_type),
      validator.validateLength('name', params.name, 4, 30),
      validator.isEmail('email', params.email),
      validator.validateLength('password', params.password, 6, 30),
      validator.isNumber('dob', params.dob),
      validator.isInclude('gender', params.gender, [
        GENDER.MALE,
        GENDER.FEMALE,
      ]),
      validator.isInclude('user_type', params.user_type, [
        USER_TYPE.USER,
        USER_TYPE.PREMIUM_USER,
        USER_TYPE.ADMIN,
        USER_TYPE.SUPER_ADMIN,
      ]),
      validator.isMobilePhone('phone', params.phone),
    ]

    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static updateProfile(params) {
    const messages = [
      validator.isRequired('name', params.name),
      validator.isRequired('dob', params.dob),
      validator.isRequired('gender', params.gender),
      validator.isRequired('address', params.address),
      validator.isRequired('phone', params.phone),
      validator.validateLength('name', params.name, 4, 30),
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

  static updateEmail(params) {
    const messages = [
      validator.isRequired('email', params.email),
      validator.isEmail('email', params.email),
    ]

    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static confirmUpdateEmail(params) {
    const messages = [validator.isRequired('token_id', params.token_id)]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static updatePassword(params) {
    const messages = [
      validator.isRequired('old_password', params.old_password),
      validator.isRequired('new_password', params.new_password),
      validator.validateLength('old_password', params.old_password, 6, 30),
      validator.validateLength('new_password', params.new_password, 6, 30),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static updateRole(params) {
    const messages = [
      validator.isRequired('user_type', params.user_type),
      validator.isInclude('user_type', params.user_type, [
        USER_TYPE.USER,
        USER_TYPE.PREMIUM_USER,
        USER_TYPE.ADMIN,
        USER_TYPE.SUPER_ADMIN,
      ]),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }
}

module.exports.UserValidation = UserValidation
