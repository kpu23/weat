var express = require('express');
var Account = require("../models/account");
var Restaurant = require("../models/restaurant");
var Crypto = require('crypto');
var router = express.Router();
var passport = require('passport');

//Customer Registration
router.route("/register")
  .get(function(req,res) {
      res.render('account/register',{title: 'weat: register'});
  })
  .post(function(req,res){
      var response = {};
      // Mongo command to check if user exists.
      Account.find({'email': req.body.email}, function (err, data) {
          console.log(data);
          if (err) {
              response = {"error": true, "message": "Error fetching data"};
              res.json(response);
          } else if (data.length > 0){
              response = {"error": false, "message": "Sorry, that email is already in use."};
              res.json(response);
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
              account.password =  Crypto
                .createHash('sha1')
                .update(req.body.password)
                .digest('base64');

              account.save(function(err) {
                  // save() will run insert() command of MongoDB.
                  // it will add new data in collection.
                  if (err) {
                      response = {"error": true, "message": "Error adding data"};
                  } else {
                      response = {"error": false, "message": "Data added"};
                  }
                  res.json(response);
              });
          }
      });
  });

//Business Registration
router.route("/register_business")
  .get(function(req,res) {
      res.render('account/register_business',{title: 'Weat: Register Business'});
  })
  .post(function(req,res){
      var response = {};
      // Mongo command to check if user exists.
      Account.find({'email': req.body.email}, function (err, data) {
          console.log(data);
          if (err) {
              response = {"error": true, "message": "Error fetching data"};
              res.json(response);
          } else if (data.length > 0){
              response = {"error": false, "message": "Sorry, that email is already in use."};
              res.json(response);
          } else {
              // Create Account
              var account = new Account();
              var restaurant = new Restaurant();
              // fetch email and password from REST request.
              // Add strict validation when you use this in Production.
              account.firstName = req.body.firstName;
              account.lastName = req.body.lastName;
              account.email = req.body.email;
              account.userType = "owner";
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
                      res.json(response);
                  } else {
                      //save account with newly created restaurantId
                      account.restaurantId = record.id;
                      account.save(function(err) {
                          // save() will run insert() command of MongoDB.
                          // it will add new data in collection.
                          if (err) {
                              response = {"error": true, "message": "Error adding account data"};
                          } else {
                              response = {"error": false, "message": "restaurant and account added"};
                          }
                          res.json(response);
                      });
                  }
              });             
          }
      });
  });

//Login Form
router.route("/login")
  .get( function(req, res) {
      res.render('account/login',{title: 'weat: sign-in'});
  })
  .post(function(req, res) {
      var response = {};
      //search for user in Database
      Account.findOne({email: req.body.username}, function(err, record){
          var password = Crypto.createHash('sha1')
            .update(req.body.password)
            .digest('base64');

          if (err || password != record.password) {
              response = {"error": true, "message": "email or password is incorrect"};
          } else {
              response = {"error": false, "message": "login successfull"};
              req.session.user = record;
          }
          res.json(response);
      });
  });

router.route("/logout")
  .post(function(req, res){
      req.session = null;
      res.render('index',{title: 'weat: home'});
  });

module.exports = router;
