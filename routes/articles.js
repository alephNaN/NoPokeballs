'use strict';

var express = require('express');
var config = require('../config');

function getModel () {
  return require('../models/articles');
}

var router = express.Router();

// Set Content-Type for all responses for these routes
router.use(function (req, res, next) {
  res.set('Content-Type', 'text/html');
  next();
});

/**
 * GET /books/add
 *
 * Display a page of books (up to ten at a time).
 */
router.get('/', function list (req, res, next) {
  getModel().list(10, req.query.pageToken, function (err, entities, cursor) {
    if (err) {
      return next(err);
    }

    res.render('articles/list.jade', {
      articles: entities,
      nextPageToken: cursor
    });
  });
});


/**
 * GET /books/:id
 *
 * Display a book.
 */
router.get('/:article', function get (req, res, next) {
  getModel().read(req.params.article, function (err, entity) {
    if (err) {
      return next(err);
    }
    res.render('articles/view.jade', {
      article: entity
    });
  });
});

/**
 * Errors on "/books/*" routes.
 */
router.use(function handleRpcError (err, req, res, next) {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
