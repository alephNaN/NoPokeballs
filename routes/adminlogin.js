'use strict';

var express = require('express');
var config = require('../config');
var oauth2 = require('../lib/oauth2');

var router = express.Router();

// expose login/logout URLs to templates.
router.use(oauth2.template);

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
router.get('/', function(req, res, next) {
    res.render('adminlogin/adminlogin.jade', {});
});

/**
 * Errors
 */
router.use(function handleRpcError (err, req, res, next) {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
