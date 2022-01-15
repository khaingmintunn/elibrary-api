'use strict'

const validator = require('../utils/validator').CustomValidator
const { RATE } = require('../constant')

class RateValidation {
  static create(params) {
    const messages = [
      validator.isRequired('rate', params.rate),
      validator.isRequired('book_id', params.book_id),
      validator.isInclude('rate', params.rate, [
        RATE.ONE,
        RATE.TWO,
        RATE.THREE,
        RATE.FOUR,
        RATE.FIVE,
      ]),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }
}

module.exports.RateValidation = RateValidation
