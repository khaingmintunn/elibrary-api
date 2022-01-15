'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const RateSchema = require('../schemas').Rate
const BookSchema = require('../schemas').Book
const RateValidation = require('../validations').Rate
const { ERROR } = require('../constant')

class RateModel {
  constructor(params) {
    this.rate_id = params.rate_id
    this.rate = params.rate
    this.book_id = params.book_id
    this.user_id = params.user_id
    this.created = params.created
    this.updated = params.updated
  }

  static async create(params) {
    const error = RateValidation.create(params)
    if (error) return { error: { status: 400, message: error } }
    const book = await BookSchema.findOne({ book_id: params.book_id })
    if (!book) return { error: { status: 412, message: ERROR.BOOK_NOT_FOUND } }

    const exist_rate = await RateSchema.findOne({
      book_id: params.book_id,
      user_id: params.current_user.user_id,
    })

    let rate = {}
    if (exist_rate) {
      rate = await RateSchema.findOneAndUpdate(
        {
          rate_id: exist_rate.rate_id,
        },
        {
          rate: params.rate,
          updated: moment().unix(),
        },
        {
          new: true,
        }
      )
    } else {
      const payload = this.ratePayload(params)
      const rate_schema = RateSchema(payload)
      rate = await rate_schema.save()
    }

    return { rate: this.toModel(rate) }
  }

  static async getRates(params) {
    const result = await RateSchema.find({
      user_id: params.current_user.user_id,
    })
    const rates = []
    result.map((rate) => {
      rates.push(this.toModel(rate))
    })

    return { rates }
  }

  /***************************************************************************************************
   * Functions
   ****************************************************************************************************/
  static async calculateRateByBookId(book_id) {
    const rates = await RateSchema.find({ book_id })
    const rate_length = rates.length
    if (rate_length === 0)
      return { rate: rate_length, rated_users: rate_length }
    const total_rate = rates.map((r) => r.rate).reduce((a, b) => a + b, 0)
    const rate = Math.floor(total_rate / rates.length)
    return { rate, rated_users: rate_length }
  }

  /**************************************************************************************************
   * Category Payload
   ***************************************************************************************************/
  static ratePayload(params) {
    return {
      rate_id: uuidv4(),
      rate: params.rate,
      book_id: params.book_id,
      user_id: params.current_user.user_id,
      created: moment().unix(),
      updated: moment().unix(),
    }
  }

  /***************************************************************************************************
   * Model
   ****************************************************************************************************/
  static toModel(params) {
    if (!params) return null

    const rate = {
      rate_id: params.rate_id !== undefined ? params.rate_id : null,
      rate: params.rate !== undefined ? params.rate : null,
      book_id: params.book_id !== undefined ? params.book_id : null,
      user_id: params.user_id !== undefined ? params.user_id : null,
      created: params.created !== undefined ? params.created : null,
      updated: params.updated !== undefined ? params.updated : null,
    }

    return new RateModel(rate)
  }
}

module.exports.RateModel = RateModel
