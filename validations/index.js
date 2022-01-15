const AuthValidation = require('./auth').AuthValidation
const UserValidation = require('./user').UserValidation
const CategoryValidation = require('./category').CategoryValidation
const BookValidation = require('./book').BookValidation
const RateValidation = require('./rate').RateValidation

module.exports = {
  Auth: AuthValidation,
  User: UserValidation,
  Category: CategoryValidation,
  Book: BookValidation,
  Rate: RateValidation,
}
