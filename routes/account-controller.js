var express = require('express');
var Account = require("../models/account");
var Restaurant = require("../models/restaurant");
var crypto = require('crypto');
var router = express.Router();
var passport = require('passport');

//Customer Registration
router.route("/register")
  .get(function(req,res) {
      res.render('account/register', {title: 'weat: register'});
  })
  .post(function(req,res){
      var response = {title: 'weat: register'};
      // Mongo command to check if user exists.
      Account.find({'email': req.body.email}, function (err, data) {
          console.log(data);
          if (err) {
              response = {"error": true, "message": "Error fetching data"};
          } else if (data.length > 0){
              response = {"error": false, "message": "Sorry, that email is already in use."};           
          } else {
              // Create Account
              var account = new Account();
              // fetch registration Info from REST request.
              // Add strict validation when you use this in Production.
              account.firstName = req.body.firstName;
              account.lastName = req.body.lastName;
              account.email = req.body.email;
              account.userType = "customer";
              account.dob = req.body.dob;
              account.ethnicity = req.body.ethnicity;
              // Hash the password using SHA1 algorithm.
              account.password =  crypto
                .createHash('sha1')
                .update(req.body.password)
                .digest('base64');

              account.save(function(err) {
                  // save() will run insert() command of MongoDB.
                  // it will add new data in collection.
                  if (err) {
                      response = {"error": true, "message": "Error adding data"};
                      res.render('account/register', response);
                  } 
                  //SUCCESS
                  res.redirect('/');                  
              });
          }
          //ERROR
          res.render('account/register', response);
      });
  });

//Business Registration
router.route("/register_business")
  .get(function(req,res) {
      res.render('account/register_business', {title: 'Weat: Register Business'});
  })
  .post(function(req,res){
      var response = {title: 'weat: register'};
      // Mongo command to check if user exists.
      Account.find({'email': req.body.email}, function (err, data) {
          console.log(data);
          if (err) {
              response = {"error": true, "message": "Error fetching data"};
          } else if (data.length > 0){
              response = {"error": false, "message": "Sorry, that email is already in use."};
          } else {
              // Create Account
              var account = new Account();
              var restaurant = new Restaurant();
              // fetch email and password from REST request.
              // Add strict validation when you use this in Production.
              account.firstName = req.body.firstName;
              account.lastName = req.body.lastName;
              account.email = req.body.email;
              account.userType = "business";
              account.dob = req.body.dob;
              
              restaurant.name = req.body.name;
              restaurant.type = req.body.type;
              restaurant.location = req.body.location;
              restaurant.phone = req.body.phone;
              restaurant.siteURL = req.body.siteURL;
              restaurant.status = req.body.status;
              restaurant.longDescription = req.body.longDescription;
              restaurant.imgPath = req.body.imgPath;
              restaurant.displayName = req.body.displayName;

              // Hash the password using SHA1 algorithm.
              account.password =  require('crypto')
                .createHash('sha1')
                .update(req.body.password)
                .digest('base64');

              restaurant.save(function(err, record){
                  if(err){
                      response = {"error": true, "message": "Error adding restaurant data"};
                  } else {
                      //save account with newly created restaurantId
                      account.restaurantId = record.id;
                      account.save(function(err) {
                          // save() will run insert() command of MongoDB.
                          // it will add new data in collection.
                          if (err) {
                              response = {"error": true, "message": "Error adding account data"};
                              res.render('account/register_business', response);
                          } 
                          //SUCCESS
                          res.redirect('/');    
                      });
                  }
                  //ERROR
                  res.render('account/register_business', response);
              });             
          }
          //ERROR
          res.render('account/register_business', response);
      });
  });

//Login Form
router.route("/login")
  .get( function(req, res) {
      res.render('account/login',{title: 'weat: sign-in', validationMessage: ''});
  })
  .post(function(req, res) {
      //search for user in Database
      Account.findOne({email: req.body.username}, function(err, record){
          if (!record) {
              res.render('account/login',{validationMessage: 'Email or password is incorrect.', title: 'weat: sign-in'});
          } else {
              // encrypt password for comparison
              var password = crypto.createHash('sha1')
                  .update(req.body.password)
                  .digest('base64');

              if (err || password != record.password) {
                  console.log(err);
                  res.render('account/login',{validationMessage: 'Email or password is incorrect.', title: 'weat: sign-in'});
              } else {
                  req.session.user = record;
                  //redirect based on user type
                  if(record.userType == 'owner'){
                      res.render('admin_home', {title: 'weat: home'});
                  }else{
                      res.render('index', {title: 'weat: home'});
                  }
              }
          }
      });
  });

router.route("/logout")
  .get(function(req, res){
      req.session = null;
      res.redirect('/');
  });

module.exports = router;
