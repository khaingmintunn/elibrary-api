const mongodb = require('../utils/mongodb')
const UserImport = require('./user')
const BookImport = require('./book')
const CategoryImport = require('./category')
require('dotenv').config()

const main = async () => {
  const message = await mongodb.connect()
  const user_messages = await UserImport.import()
  const category_messages = await CategoryImport.import()
  const book_messages = await BookImport.import()
  user_messages.map((user_message, index) => {
    if (index === 0)
      console.log(
        '===============================\nUsers\n==============================='
      )
    console.log(user_message)
  })
  category_messages.map((category_message, index) => {
    if (index === 0)
      console.log(
        '===============================\nCategories\n==============================='
      )
    console.log(category_message)
  })
  book_messages.map((book_message, index) => {
    if (index === 0)
      console.log(
        '===============================\nBooks\n==============================='
      )
    console.log(book_message)
  })
}

main()
