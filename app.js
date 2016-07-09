'use strict';

var path = require('path');
var express = require('express');
var session = require('express-session');
var MemcachedStore = require('connect-memcached')(session);
var passport = require('passport');
var config = require('./config');

var app = express();

app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', true);

// [START session]
// Configure the session and session storage.
var sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true
};

// In production use the App Engine Memcache instance to store session data,
// otherwise fallback to the default MemoryStore in development.
if (config.get('NODE_ENV') === 'production') {
  sessionConfig.store = new MemcachedStore({
    hosts: [config.get('MEMCACHE_URL')]
  });
}

app.use(session(sessionConfig));
// [END session]

// OAuth2
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./lib/oauth2').router);

// [Start page routings]
// Serve static pages
app.use(express.static(path.join(__dirname, 'static')));

app.use('/pokedex', require('./routes/pokedex.js'));
app.use('/index', require('./routes/index.js'));
app.use('/adminlogin', require('./routes/adminlogin.js'));
app.use('/addpokemon', require('./routes/addpokemon.js'));

// Redirect root to /home
app.get('/', function (req, res) {
  res.redirect('/index');
});

// Basic 404 handler
app.use(function (req, res) {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use(function (err, req, res, next) {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  var server = app.listen(config.get('PORT'), function () {
    var port = server.address().port;
    console.log('App listening on port %s', port);
  });
}
// [End page routings]

module.exports = app;
