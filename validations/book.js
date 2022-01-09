'use strict'

const validator = require('../utils/validator').CustomValidator
const { PUBLISH_STATUS, RATE, IS_AVAILABLE } = require('../constant')

class BookValidation {
  static create(params) {
    const messages = [
      validator.isRequired('title', params.title),
      validator.isRequired('author', params.author),
      validator.isRequired('description', params.description),
      validator.isRequired('category_id', params.category_id),
      validator.isRequired('rate', params.rate),
      validator.isRequired('publish_date', params.publish_date),
      validator.isRequired('status', params.status),
      validator.validateLength('title', params.title, 2, 100),
      validator.validateLength('author', params.author, 2, 100),
      validator.validateLength('description', params.description, 2, 1500),
      validator.isInclude('rate', params.rate, [
        RATE.ONE,
        RATE.TWO,
        RATE.THREE,
        RATE.FOUR,
        RATE.FIVE,
      ]),
      validator.isNumber('publish_date', params.publish_date),
      validator.isInclude('status', params.status, [
        PUBLISH_STATUS.PUBLISH,
        PUBLISH_STATUS.DRAFT,
      ]),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static update(params) {
    const messages = [
      validator.validateLength('title', params.title, 2, 100),
      validator.validateLength('author', params.author, 2, 100),
      validator.validateLength('description', params.description, 2, 1500),
      validator.isInclude('rate', params.rate, [
        RATE.ONE,
        RATE.TWO,
        RATE.THREE,
        RATE.FOUR,
        RATE.FIVE,
      ]),
      validator.isNumber('publish_date', params.publish_date),
      validator.isInclude('status', params.status, [
        PUBLISH_STATUS.PUBLISH,
        PUBLISH_STATUS.DRAFT,
      ]),
      validator.isInclude('is_available', params.is_available, [
        IS_AVAILABLE.AVAILABLE,
        IS_AVAILABLE.UNAVAILABLE,
      ]),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }
}

module.exports.BookValidation = BookValidation
