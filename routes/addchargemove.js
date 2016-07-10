'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var config = require('../config');
var images = require('../lib/images');
var oauth2 = require('../lib/oauth2');

var router = express.Router();

function getModel () {
  return require('../models/pokemon');
}

router.use(function (req, res, next) {
  res.set('Content-Type', 'text/html');
  next();
});

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

/**
 * GET /books/add
 *
 * Display a form for adding a charge move
 */
router.get('/', oauth2.required, function addForm (req, res) {
    
  getModel().getListOfPokemonNumbers(function (err, pokemonNumbers, cursor) {
    if (err) {
      res.redirect('/');
    }
    
    res.render('adminlogin/addchargemove.jade', {
      pokemonNumbers: pokemonNumbers,
      action: 'Add'
    });
  });

});

module.exports = router;