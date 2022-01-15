const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { RATE } = require('../constant')

const RateSchema = new Schema({
  rate_id: {
    type: String,
    required: true,
    unique: true,
  },
  rate: {
    type: Number,
    required: true,
    enum: [RATE.ONE, RATE.TWO, RATE.THREE, RATE.FOUR, RATE.FIVE],
  },
  book_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  created: {
    type: Number,
    required: true,
  },
  updated: {
    type: Number,
  },
})

module.exports = mongoose.model('Rate', RateSchema)
