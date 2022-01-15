'use strict'

const validator = require('../utils/validator').CustomValidator

class CategoryValidation {
  static create(params) {
    const messages = [
      validator.isRequired('name', params.name),
      validator.validateLength('name', params.name, 2, 100),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }
}

module.exports.CategoryValidation = CategoryValidation
