const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new Schema({
  token_id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  expired: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
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

module.exports = mongoose.model('Token', TokenSchema)
