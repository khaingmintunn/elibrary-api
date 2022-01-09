const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  category_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
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

module.exports = mongoose.model('Category', CategorySchema)
