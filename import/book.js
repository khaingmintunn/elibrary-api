const fs = require('fs')
const moment = require('moment')
const filePath = './import/statics/books.json'
const items = fs.readFileSync(filePath)
const rawItems = JSON.parse(items)
const BookSchema = require('../schemas').Book

class BookImport {
  static async import() {
    const messages = []
    await Promise.all(
      rawItems.map(async (rawItem) => {
        messages.push(await this.importStaticData(rawItem))
      })
    )
    const result = messages.filter((message) => {
      return message !== null
    })

    return result
  }

  static async importStaticData(book) {
    const exist_book = await BookSchema.findOne({ book_id: book.book_id })
    if (exist_book) return null
    const payload = await this.bookPayload(book)
    const schema = BookSchema(payload)
    const result = await schema.save()
    return result ? `${result.title} is added.` : null
  }

  static async bookPayload(params) {
    return {
      book_id: params.book_id,
      title: params.title,
      author: params.author,
      description: params.description,
      category_id: params.category_id,
      rate: params.rate,
      publish_date: params.publish_date,
      url: params.url,
      is_available: params.is_available,
      status: params.status,
      user_id: params.user_id,
      created: moment().unix(),
      updated: moment().unix(),
    }
  }
}

module.exports = BookImport
