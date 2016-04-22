var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

// connect to the db
mongoose.connect("mongodb://localhost:27017/weat", function(err, db) {
    if(!err) {
        console.log("Connected to Mongo!");
    } else {
        console.log(err);
    }
});

// // set-up auth
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//       Account.findOne({ email: email }, function (err, account) {
//           if (err) { return done(err); }
//           if (!account) { return done(null, false); }
//           if (!account.verifyPassword(password)) { return done(null, false); }
//           return done(null, user);
//       });
//   }
// ));

// import routes
var routes = require('./routes/index-controller');
var account = require('./routes/account-controller');
var restaurant = require('./routes/restaurant-controller');
var customer = require('./routes/customer-controller');
var business = require('./routes/business-controller');
var analytics = require('./routes/analytics-controller');

var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({secret: '1234567890QWERTY'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

//Pre-called function before routing
app.use(function(req, res, next){
  //set ejs variables to be used on every page
  res.locals.error = false;
  res.locals.message = '';
  res.locals.session = req.session;
  next();
});

app.use('/', routes);
app.use('/', account);
app.use('/', restaurant);
app.use('/', customer);
app.use('/', business);
app.use('/', analytics);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
