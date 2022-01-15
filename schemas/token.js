const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { TOKEN_TYPE } = require('../constant')

const TokenSchema = new Schema({
  token_id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      TOKEN_TYPE.SIGNUP,
      TOKEN_TYPE.AUTH,
      TOKEN_TYPE.PASSWORD_RESET,
      TOKEN_TYPE.EMAIL_UPDATE,
    ],
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
