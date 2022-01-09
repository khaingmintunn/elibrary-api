const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
  },
  user_type: {
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

module.exports = mongoose.model('User', UserSchema)
