'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const CategorySchema = require('../schemas').Category
const CategoryValidation = require('../validations').Category
const { ERROR } = require('../constant')

class CategoryModel {
  constructor(params) {
    this.category_id = params.category_id
    this.name = params.name
    this.user_id = params.user_id
    this.created = params.created
    this.updated = params.updated
  }

  /**************************************************************************************************
   * Functions
   ***************************************************************************************************/
  static async create(params) {
    const error = CategoryValidation.create(params)
    if (error) return { error: { status: 400, message: error } }

    const exist_category = await this._getByName(params.name)
    if (exist_category)
      return { error: { status: 422, message: ERROR.CATEGORY_EXIST_MESSAGE } }

    const payload = await this.categoryPayload(params)
    const category_schema = CategorySchema(payload)
    const category = await category_schema.save()
    return { category: this.toModel(category) }
  }

  static async getCategories(params) {
    if (params.name) return await this._searchByName(params.name)

    return await this._getAll()
  }

  static async getCategory(params) {
    const category = await CategorySchema.findOne({
      category_id: params.category_id,
    })

    return { category: this.toModel(category) }
  }

  static async update(params) {
    const error = CategoryValidation.create(params)
    if (error) return { error: { status: 400, message: error } }
    const result = await this.getCategory(params)
    if (!result.category)
      return { error: { status: 404, message: ERROR.CATEGORY_NOT_FOUND } }

    const category = await CategorySchema.findOneAndUpdate(
      {
        category_id: params.category_id,
      },
      {
        name: params.name,
        updated: moment().unix(),
      },
      {
        new: true,
      }
    )

    return { category: this.toModel(category) }
  }

  static async delete(params) {
    const result = await this.getCategory(params)
    if (!result.category)
      return { error: { status: 404, message: ERROR.CATEGORY_NOT_FOUND } }

    await CategorySchema.findOneAndRemove({
      category_id: params.category_id,
    })

    return { message: `Deleted ${result.category.name} successfully.` }
  }

  /**************************************************************************************************
   * Category Payload
   ***************************************************************************************************/
  static async categoryPayload(params) {
    return {
      category_id: uuidv4(),
      name: params.name,
      user_id: params.current_user.user_id,
      created: moment().unix(),
    }
  }

  /**************************************************************************************************
   * Query
   ***************************************************************************************************/
  static async _getByName(name) {
    const category = await CategorySchema.findOne({ name })

    return this.toModel(category)
  }

  static async _searchByName(name) {
    const result = await CategorySchema.find({
      name: { $regex: new RegExp('.*' + name + '.*', 'i') },
    }).sort({ name: 1 })
    const categories = []
    result.map((res) => {
      categories.push(this.toModel(res))
    })

    return { categories }
  }

  static async _getAll() {
    const result = await CategorySchema.find().sort({ name: 1 })
    const categories = []
    result.map((res) => {
      categories.push(this.toModel(res))
    })

    return { categories }
  }

  /***************************************************************************************************
   * Model
   ****************************************************************************************************/
  static toModel(params) {
    if (!params) return null

    const category = {
      category_id: params.category_id !== undefined ? params.category_id : null,
      name: params.name !== undefined ? params.name : null,
      user_id: params.user_id !== undefined ? params.user_id : null,
      created: params.created !== undefined ? params.created : null,
      updated: params.updated !== undefined ? params.updated : null,
    }

    return new CategoryModel(category)
  }
}

module.exports.CategoryModel = CategoryModel
