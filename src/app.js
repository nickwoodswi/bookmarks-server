//where are log files?

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
//const bookmarkRouter = require('./bookmark-router')
const logger = require('./logger')
const BookmarksService = require('./bookmarks-service')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(function validateBearerToken(req, res, next) {
    
    const bearerToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    console.log(bearerToken)
    console.log(authToken)
  
    if (!authToken || authToken.split(' ')[1] !== bearerToken) {
        logger.error(`Unauthorized request to path: ${req.path}`)
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next() 
  })

app.get('/bookmarks', (req, res, next) => {
  const knexInstance = req.app.get('db')
  BookmarksService.getAllArticles(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks)
    })
    .catch(next)
})

app.post('/bookmarks', (req, res, next) => {
  res.status(201).send('stuff')
})

//app.use(bookmarkRouter)

app.get('/bookmarks/:bookmark_id', (req, res, next) => {
  BookmarksService.getById(
    req.app.get('db'),
    req.params.bookmark_id
  )
    .then(bookmark => {
      res.json({
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        rating: bookmark.rating,
        description: bookmark.description
      })
    })
    .catch(next)
})
  

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app