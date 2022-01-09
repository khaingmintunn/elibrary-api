const AuthModel = require('./auth').AuthModel
const UserModel = require('./user').UserModel
const TokenModel = require('./token').TokenModel
const CategoryModel = require('./category').CategoryModel
const BookModel = require('./book').BookModel

module.exports = {
  Auth: AuthModel,
  User: UserModel,
  Token: TokenModel,
  Category: CategoryModel,
  Book: BookModel,
}
