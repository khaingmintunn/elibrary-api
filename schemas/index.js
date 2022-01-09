const UserSchema = require('./user')
const TokenSchema = require('./token')
const CategorySchema = require('./catrgory')
const BookSchema = require('./book')

module.exports = {
  User: UserSchema,
  Token: TokenSchema,
  Category: CategorySchema,
  Book: BookSchema,
}
