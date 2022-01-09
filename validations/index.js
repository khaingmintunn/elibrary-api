const AuthValidation = require('./auth').AuthValidation
const UserValidation = require('./user').UserValidation
const CategoryValidation = require('./category').CategoryValidation
const BookValidation = require('./book').BookValidation

module.exports = {
  Auth: AuthValidation,
  User: UserValidation,
  Category: CategoryValidation,
  Book: BookValidation,
}
