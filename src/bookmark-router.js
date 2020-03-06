const express = require('express')
const uuid = require('uuid/v4')
const logger = require('./logger')
const { bookmarks } = require('./store')

const bookmarkRouter = express.Router()

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {res.json(bookmarks)})
  .post((req, res) => {
    const { title, url, rating, desc } = req.body

  if (!title) {
      logger.error(`Title is required`)
  }
  if (!url) {
      logger.error(`URL is required`)
  }

  const id = uuid();

  const bookmark = {
    id,
    title,
    url,
    rating,
    desc
  };

  bookmarks.push(bookmark);

  logger.info(`Bookmark with id ${id} created`);

  res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${id}`)
    .json(bookmark);
  })


bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.find(b => b.id == id)
  
    // make sure there's a bookmark
  
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res 
        .status(404)
        .send(`Bookmark not found`)
    }
  
    res
      .json(bookmark)
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(li => li.id == id);
  
    if (bookmarkIndex === -1) {
      logger.error(`List with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`List with id ${id} deleted.`);
      res
        .status(204)
        .end();
  })

module.exports = bookmarkRouter