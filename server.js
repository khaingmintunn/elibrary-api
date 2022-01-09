const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const mongodb = require('./utils/mongodb')
const app = express()
require('dotenv').config()
const services = require('./services')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

app.use(body_parser.json())
app.use(cors())
app.use(logger('dev'))
mongodb.connect()
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})
app.set('etag', false)
app.use(`/${process.env.VERSION}/`, services)
app.use(
  `/${process.env.VERSION}/doc`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
  })
)

app.listen(process.env.PORT, () => {
  console.log('E-library Server is up .')
})
