'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var config = require('../config');
var images = require('../lib/images');
var oauth2 = require('../lib/oauth2');

var router = express.Router();

function getModel () {
  return require('../models/datastore');
}

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

/**
 * GET /books/add
 *
 * Display a form for creating a book.
 */
router.get('/', oauth2.required, function addForm (req, res) {
  res.render('adminlogin/addpokemon.jade', {
    pokemon: {},
    action: 'Add'
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
  images.multer.single('image'),
  images.sendUploadToGCS,
  function insert (req, res, next) {
    var data = req.body;

    data.createdBy = req.user.displayName;
    data.createdById = req.user.id;

    // Was an image uploaded? If so, we'll use its public URL
    // in cloud storage.
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
    }

    // Save the data to the database.
    getModel().create(data, function (err, savedData) {
      if (err) {
        return next(err);
      }
      res.redirect(req.baseUrl + '/' + savedData.id);
    });

  }
);

module.exports = router;