const mongoose = require('mongoose')
let dbconnection = ''

class Mongodb {
  /**
   * Connect Mongo DB
   */
  static async connect() {
    await new Promise((resolve) => {
      mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      dbconnection = mongoose.connection
      dbconnection.on(
        'error',
        console.error.bind(console, 'Database connection error')
      )
      dbconnection.once('open', () => {
        resolve('Connected database.')
        console.log('Connected database.')
      })
    })
  }
}

module.exports = Mongodb
