const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const entryRouter = require('./controllers/entries')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


mongoose.set('strictQuery',false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })    


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/persons', entryRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app    