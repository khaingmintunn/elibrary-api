'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const BookSchema = require('../schemas').Book
const RateModel = require('../models/rate').RateModel
const CategoryModel = require('../models/category').CategoryModel
const BookValidation = require('../validations').Book
const { IS_AVAILABLE, PUBLISH_STATUS, ERROR } = require('../constant')

class BookModel {
  constructor(params) {
    this.book_id = params.book_id
    this.title = params.title
    this.author = params.author
    this.description = params.description
    this.category_id = params.category_id
    this.rate = params.rate
    this.rated_users = params.rated_users
    this.publish_date = params.publish_date
    this.url = params.title
    this.is_available = params.is_available
    this.status = params.status
    this.user_id = params.user_id
    this.created = params.created
    this.updated = params.updated
  }

  static async getBooks(params) {
    const query = {
      status: PUBLISH_STATUS.PUBLISH,
    }
    if (params.title)
      query['title'] = { $regex: new RegExp('.*' + params.title + '.*', 'i') }
    if (params.author)
      query['author'] = { $regex: new RegExp('.*' + params.author + '.*', 'i') }
    if (params.description)
      query['description'] = {
        $regex: new RegExp('.*' + params.description + '.*', 'i'),
      }
    if (params.category_id) query['category_id'] = params.category_id
    if (params.is_available) query['is_available'] = params.is_available
    if (params.rate) query['rate'] = params.rate
    if (params.start && params.end)
      query['publish_date'] = { $gte: params.start, $lt: params.end }

    const books = await this._searchByQuery(query)
    return { books }
  }

  static async getBookById(params) {
    const book = await this._getById(params.book_id)

    return { book }
  }

  static async create(params) {
    const error = BookValidation.create(params)
    if (error) return { error: { status: 400, message: error } }

    const result = await CategoryModel.getCategory(params)
    if (!result?.category)
      return { error: { status: 400, message: 'Invalid Category.' } }

    const book_payload = this.bookPayload(params)
    const book_schema = BookSchema(book_payload)
    const book = await book_schema.save()

    return { book: await this.arrageBookModel(book) }
  }

  static async update(params) {
    const error = BookValidation.update(params)
    if (error) return { error: { status: 400, message: error } }

    const result = await this.getBookById(params)
    if (!result?.book?.book_id)
      return { error: { status: 404, message: ERROR.BOOK_NOT_FOUND } }

    const res = await CategoryModel.getCategory(params)
    if (!res?.category)
      return { error: { status: 400, message: 'Invalid Category.' } }

    const book = await this._update(params, result.book)
    return { book }
  }

  static async delete(params) {
    const result = await this.getBookById(params)
    if (!result?.book?.book_id)
      return { error: { status: 404, message: ERROR.BOOK_NOT_FOUND } }

    await BookSchema.findOneAndRemove({ book_id: params.book_id })

    return { message: 'Deleted book successfully.' }
  }

  static async _update(params, book) {
    const updated_book = await BookSchema.findOneAndUpdate(
      { book_id: book.book_id },
      {
        title: params.title || book.title,
        author: params.author || book.author,
        description: params.description || book.description,
        category_id: params.category_id || book.category_id,
        publish_date: params.publish_date || book.publish_date,
        url: params.url || book.url,
        is_available:
          params.is_available !== null
            ? params.is_available
            : book.is_available,
        status: params.status || book.status,
        updated: moment().unix(),
      },
      { new: true }
    )

    return await this.arrageBookModel(updated_book)
  }

  static async arrageBookModel(params) {
    const { rate, rated_users } = await RateModel.calculateRateByBookId(
      params.book_id
    )
    const book = { ...params?._doc, rate, rated_users }

    return this.toModel(book)
  }

  /***************************************************************************************************
   * Query
   ****************************************************************************************************/
  static async _getAll() {
    const result = await BookSchema.find().sort({ created: -1 })

    const books = []
    await Promise.all(
      result.map(async (res) => {
        books.push(await this.arrageBookModel(res))
      })
    )
    return books
  }

  static async _getById(book_id) {
    const book = await BookSchema.findOne({ book_id })

    return book ? await this.arrageBookModel(book) : null
  }

  static async _searchByQuery(query) {
    const result = await BookSchema.find(query).sort({ created: -1 })
    const books = []
    await Promise.all(
      result.map(async (res) => {
        books.push(await this.arrageBookModel(res))
      })
    )
    return books
  }

  /**************************************************************************************************
   * Category Payload
   ***************************************************************************************************/
  static bookPayload(params) {
    return {
      book_id: uuidv4(),
      title: params.title,
      author: params.author,
      description: params.description,
      category_id: params.category_id,
      publish_date: params.publish_date,
      url: params.url,
      is_available: IS_AVAILABLE.AVAILABLE,
      status: params.status,
      user_id: params.current_user.user_id,
      created: moment().unix(),
    }
  }

  /***************************************************************************************************
   * Model
   ****************************************************************************************************/
  static toModel(params) {
    if (!params) return null

    const book = {
      book_id: params.book_id !== undefined ? params.book_id : null,
      title: params.title !== undefined ? params.title : null,
      author: params.author !== undefined ? params.author : null,
      description: params.description !== undefined ? params.description : null,
      category_id: params.category_id !== undefined ? params.category_id : null,
      rate: params.rate !== undefined ? params.rate : 0,
      rated_users: params.rated_users !== undefined ? params.rated_users : 0,
      publish_date:
        params.publish_date !== undefined ? params.publish_date : null,
      url: params.url !== undefined ? params.url : null,
      is_available:
        params.is_available !== undefined ? params.is_available : null,
      status: params.status !== undefined ? params.status : null,
      user_id: params.user_id !== undefined ? params.user_id : null,
      created: params.created !== undefined ? params.created : null,
      updated: params.updated !== undefined ? params.updated : null,
    }

    return new BookModel(book)
  }
}

module.exports.BookModel = BookModel
