var express = require('express');
var Account = require("../models/account");
var PaymentOption = require("../models/payment-option");
var Restaurant = require("../models/restaurant");
var crypto = require('crypto');
var router = express.Router();
var passport = require('passport');

//Customer Registration
router.route("/register")
  .get(function(req,res) {
      res.render('account/Register.ejs', {title: 'Weat: Register'});
  })
  .post(function(req,res){
      var response = {title: 'Weat: Register'};
      // Mongo command to check if user exists.
      Account.find({'email': req.body.email}, function (err, data) {
          console.log(data);
          if (err) {
              response.error = true;
              response.message = "Error fetching data";
              res.render('account/Register.ejs', response);
          } else if (data.length > 0){
              response.error = true;
              response.message = "Sorry, that email is already in use.";
              res.render('account/Register.ejs', response);          
          } else {
              // Create Account
              var account = new Account();
              account.firstName = req.body.firstName;
              account.lastName = req.body.lastName;
              account.email = req.body.email;
              account.userType = "customer";
              account.phone = req.body.phone;
              account.dob = req.body.dob;
              account.ethnicity = req.body.ethnicity;
              account.gender = req.body.gender;
              // Hash the password using SHA1 algorithm.
              account.password =  crypto
                .createHash('sha1')
                .update(req.body.password)
                .digest('base64');

              account.save(function(err, record) {
                  // save() will run insert() command of MongoDB.
                  // it will add new data in collection.
                  if (err) {                 
                      response.error = true;
                      response.message = "Error adding account data";
                      console.log('error1', err, response);
                      res.render('account/Register.ejs', response);
                  }else{
                      //SUCCESS
                      req.session.user = record;
                      res.redirect('/'); 
                  }                  
              });
          }
      });
  });

//Business Registration
router.route("/register_business")
  .get(function(req,res) {
      res.render('account/Register_business.ejs', {title: 'Weat: Register Business'});
  })
  .post(function(req,res){
      var response = {title: 'Weat: Register Business'};
      // Mongo command to check if user exists.
      Account.find({'email': req.body.email}, function (err, data) {
          console.log(data);
          if (err) {
              response.error = true;
              response.message = "Error fetching data";
              res.render('account/Register_business.ejs', response);
          } else if (data.length > 0){
              response.error = true;
              response.message = "Sorry, that email is already in use.";
              res.render('account/Register_business.ejs', response);
          } else {
              // Create Account
              var account = new Account();
              var restaurant = new Restaurant();
              // fetch email and password from REST request.
              // Add strict validation when you use this in Production.
              account.firstName = req.body.firstName;
              account.lastName = req.body.lastName;
              account.email = req.body.email;
              account.phone = req.body.phone;
              account.userType = "business";
              account.dob = req.body.dob;
              account.gender = req.body.gender;
              
              restaurant.name = req.body.name;
              restaurant.type = req.body.type;
              restaurant.location = req.body.location;
              restaurant.phone = req.body.workPhone;
              //restaurant.siteURL = req.body.siteURL;
              restaurant.status = req.body.status;
              restaurant.longDescription = req.body.longDescription;
              if(req.body.imgPath) restaurant.imgPath = req.body.imgPath;
              else restaurant.imgPath = '/images/default_restaurant_logo.jpg';             
              restaurant.displayName = req.body.displayName;

              // Hash the password using SHA1 algorithm.
              account.password =  require('crypto')
                .createHash('sha1')
                .update(req.body.password)
                .digest('base64');

              restaurant.save(function(err, record){
                  if(err){
                      response.error = true;
                      response.message = "Error adding restaurant data";
                      res.render('account/Register_business.ejs', response);
                  } else {
                      //save account with newly created restaurantId
                      account.restaurantId = record.id;
                      account.save(function(err, record) {                      
                          if (err) {
                              response.error = true;
                              response.message = "Error adding account data";
                              res.render('account/Register_business.ejs', response);
                          } else {
                              //SUCCESS
                              req.session.user = record;
                              res.redirect('/');    
                          }
                      });
                  }       
              });             
          }
      });
  });

//Login Form
router.route("/login")
  .get( function(req, res) {
      res.render('account/Login.ejs',{title: 'weat: sign-in', validationMessage: ''});
  })
  .post(function(req, res) {
      //search for user in Database
      Account.findOne({email: req.body.username}, function(err, record){
          if (!record) {
              res.render('account/Login.ejs',{validationMessage: 'Email or password is incorrect.', title: 'weat: sign-in'});
          } else {
              // encrypt password for comparison
              var password = crypto.createHash('sha1')
                  .update(req.body.password)
                  .digest('base64');

              if (err || password != record.password) {
                  console.log(err);
                  res.render('account/Login.ejs',{validationMessage: 'Email or password is incorrect.', title: 'weat: sign-in'});
              } else {
                  req.session.user = record;
                  //redirect based on user type
                  if(record.userType == 'owner'){
                      res.redirect('/admin');
                  }else{
                      res.redirect('/');
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

  //Login Form
router.route("/settings")
  .get( function(req, res) {
      PaymentOption.findOne({acountId: req.session.user._id}, function(err, record) {
          if(err){              
              res.render('Error.ejs', {
                  message: err.message,
                  error: err
              });
          }else{
              var paymentOption = record;
              if (!paymentOption){
                  paymentOption = {
                    "accountId" : "",
                    "nameOnCard" : "",
                    "number" : "",
                    "expirationDate" : "",
                    "cvv" : "",
                    "address" : "",
                    "city" : "",
                    "state" : "",
                    "zip" : "",
                  }
              }         
              res.render('account/Settings.ejs',{title: 'weat: settings', validationMessage: '', paymentOption: paymentOption});
          }
      });
      
  });

router.route("/getSettingsData")
  .get( function(req, res) {
      PaymentOption.findOne({acountId: req.session.user._id}, function(err, record) {
          if(err){              
              res.render('Error.ejs', {
                  message: err.message,
                  error: err
              });
          }else{
              var paymentOption = record;
              if (!paymentOption){
                  paymentOption = {
                    "accountId" : "",
                    "nameOnCard" : "",
                    "number" : "",
                    "expirationDate" : "",
                    "cvv" : "",
                    "address" : "",
                    "city" : "",
                    "state" : "",
                    "zip" : "",
                  }
              }         
              res.send({user: req.session.user, paymentOption: paymentOption});
          }
      });
  });

router.route("/saveUserInfo")
  .post(function(req, res){
    console.log(req.body);
      var response = {status: 'error'};      
      Account.findOneAndUpdate({email: req.session.user.email}, req.body, {new: true}, function(err, record) {
          if(err){              
              response.message = 'error saving user info';
              res.send(response);
          }else{
              console.log(record);
              response.status = 'success';
              req.session.user = record;
              res.send(response);
          }
      }); 
  });

router.route("/savePaymentInfo")
  .post(function(req, res){
      var response = {status: 'error'};
      var paymentOption = req.body;      
      paymentOption.accountId = req.session.user._id;
      PaymentOption.findOneAndUpdate({acountId: req.session.user._id}, req.body, {upsert: true}, function(err, record) {
          if(err){              
              response.message = 'error saving payment option';
              res.send(response);
          }else{
              console.log(record);
              response.status = 'success';
              res.send(response);
          }
      });
  });

module.exports = router;
