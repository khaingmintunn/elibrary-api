const fs = require('fs')
const moment = require('moment')
const filePath = './import/statics/categories.json'
const items = fs.readFileSync(filePath)
const rawItems = JSON.parse(items)
const CategorySchema = require('../schemas').Category

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

  static async importStaticData(category) {
    const exist_category = await CategorySchema.findOne({
      category_id: category.category_id,
    })
    if (exist_category) return null
    const payload = await this.categoryPayload(category)
    const schema = CategorySchema(payload)
    const result = await schema.save()
    return result ? `${result.name} is added.` : null
  }

  static async categoryPayload(params) {
    return {
      category_id: params.category_id,
      name: params.name,
      user_id: params.user_id,
      created: moment().unix(),
      updated: moment().unix(),
    }
  }
}

module.exports = BookImport
