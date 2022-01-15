const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { AUTH_STATUS, USER_TYPE } = require('../constant')

const UserSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  auth_status: {
    type: String,
    required: true,
    enum: [AUTH_STATUS.NO_AUTH, AUTH_STATUS.AUTHED, AUTH_STATUS.SUSPENDED],
  },
  user_type: {
    type: String,
    required: true,
    enum: [
      USER_TYPE.USER,
      USER_TYPE.PREMIUM_USER,
      USER_TYPE.ADMIN,
      USER_TYPE.SUPER_ADMIN,
    ],
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

module.exports = mongoose.model('User', UserSchema)
