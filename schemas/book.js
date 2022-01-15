const mongoose = require('mongoose')
const { RATE, PUBLISH_STATUS } = require('../constant')
const Schema = mongoose.Schema

const BookSchema = new Schema({
  book_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  author: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  publish_date: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  is_available: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: [PUBLISH_STATUS.DRAFT, PUBLISH_STATUS.PUBLISH],
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
    required: false,
  },
})

module.exports = mongoose.model('Book', BookSchema)
