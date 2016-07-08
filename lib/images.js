'use strict';

var gcloud = require('gcloud');
var config = require('../config');

var CLOUD_BUCKET = config.get('CLOUD_BUCKET');

var storage = gcloud.storage({
  projectId: config.get('GCLOUD_PROJECT')
});
var bucket = storage.bucket(CLOUD_BUCKET);

// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
// [START public_url]
function getPublicUrl (filename) {
  return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
}
// [END public_url]

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS (req, res, next) {
  if (!req.file) {
    return next();
  }

  var gcsname = Date.now() + req.file.originalname;
  var file = bucket.file(gcsname);
  var stream = file.createWriteStream();

  stream.on('error', function (err) {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', function () {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
}
// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory and re-name to avoid
// conflicting with existing objects. This makes it straightforward to upload
// to Cloud Storage.
// [START multer]
var multer = require('multer')({
  inMemory: true,
  fileSize: 5 * 1024 * 1024, // no larger than 5mb
  rename: function (fieldname, filename) {
    // generate a unique filename
    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
  }
});
// [END multer]

module.exports = {
  getPublicUrl: getPublicUrl,
  sendUploadToGCS: sendUploadToGCS,
  multer: multer
};