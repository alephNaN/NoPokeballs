'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var config = require('../config');
var images = require('../lib/images');
var oauth2 = require('../lib/oauth2');

var router = express.Router();

function getModelPokemon () {
  return require('../models/pokemon');
}

function getModelChargeMove() {
  return require('../models/chargemove')
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
    
  getModelPokemon().getListOfPokemonNumbers(function (err, pokemonNumbers, cursor) {
    if (err) {
      res.redirect('/');
    }
    
    res.render('adminlogin/addchargemove.jade', {
      pokemonNumbers: pokemonNumbers,
      chargemove: {},
      action: 'Add'
    });
  });

});


/**
 * POST /books/add
 *
 * Create a book.
 */
// [START add]
router.post('/',
  oauth2.required,
  function insert (req, res, next) {
    // Save the data to the database.
    getModelChargeMove().create(req.body, function (err, savedData) {
      if (err) {
        return next(err);
      } else {
        res.redirect(req.baseUrl);
      }
    });
  }
);

module.exports = router;