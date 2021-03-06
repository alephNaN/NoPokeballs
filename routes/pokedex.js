'use strict';

var express = require('express');
var config = require('../config');

function getModelPokemon () {
  return require('../models/pokemon');
}

function getModelChargeMove() {
  return require('../models/chargemove');  
}

var router = express.Router();

// Set Content-Type for all responses for these routes
router.use(function (req, res, next) {
  res.set('Content-Type', 'text/html');
  next();
});

// Group a list of items into rows
const NUM_COLUMNS = 4;
function getRows(items) {
    return items.reduce(function (prev, item, i) {
        if(i % NUM_COLUMNS === 0)
            prev.push([item]);
        else
            prev[prev.length - 1].push(item);

        return prev;
    }, []);
}

/**
 * GET /books/add
 *
 * Display a page of books (up to ten at a time).
 */
router.get('/', function list (req, res, next) {
  getModelPokemon().list(24, req.query.pageToken, function (err, entities, cursor) {
    if (err) {
      return next(err);
    }
    
    // Convert list of types into array
    entities.forEach( pokemon => 
      pokemon.types = pokemon.types.split(",")
    );
    
    res.render('pokedex/list.jade', {
      pokemons: getRows(entities),
      nextPageToken: cursor
    });
  });
});


/**
 * GET /books/:id
 *
 * Display a book.
 */
router.get('/:pokemon', function get (req, res, next) {
  getModelPokemon().read(req.params.pokemon, function (err, entity) {
    if (err) {
      return next(err);
    }
    
    // Lookup charge moves for this pokemon
    var pokemonNumber = entity.number;
    getModelChargeMove().listByPokemon(pokemonNumber, function(
      err, chargemoves) {
        if (err) {
          
        } else {
          res.render('pokedex/view.jade', {
            pokemon: entity,
            chargemoves: chargemoves
          });
        }
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
