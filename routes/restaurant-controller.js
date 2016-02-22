/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var Title = 'weat: all restaurants';



router.route("/restaurants")
  .get(function(req,res) {
    if(typeof(req.query.q) != "undefined")
    {
      console.log("get request: " + req.query.q);
      var searchTerm = req.query.q.toLowerCase();

      Restaurant.find( {status: 1, $or: [{name: searchTerm}, {foodtype: searchTerm}, {displayName: searchTerm}]}, function (error, results){
        if(error){
          return console.error(error);
        } 

        //not sure how to check if empty...
        
        if(results)
        {
          console.log("Results: ");
          console.log(results);
          console.log(typeof(results));
          res.render('Restaurants',{title: Title, restaurants: results});
        }
      });
      //console.log(searchResults._collection.collection);  
      //var restaurants = [{name: req.query.q}];
      //res.render("Restaurants", {title: "test", restaurants: restaurants})
    }
    else
    {

     /*var newRest = new Restaurant(); 
      newRest.name = "savas";
      newRest.status = 1;
      newRest.location = "philly";
      newRest.foodtype = ["pizza", "cheesesteak"];
      console.log(newRest);
      newRest.save();*/

      
     console.log("here");

      Restaurant.find(function (error, results){
        if(error){
          return console.error(error);
        }
        else
        {
          console.log("Results: ");
          console.log(results);
          res.render('Restaurants',{title: Title, restaurants: results});
        }
      });
      //console.log(restaurants);
      
    }
    
    
    //restaurants = [{name: "TESST"},{name: "TESST2"}];
   
  })
  .post(function(req,res){
    var response = {};
    // Mongo command to check if user exists.
    User.find({'email': req.body.email}, function (err, data) {
      console.log(data);
      if (err) {
        response = {"error": true, "message": "Error fetching data"};
        res.json(response);
      } else if (data.length > 0){
        response = {"error": false, "message": "Sorry, that email is already in use."};
        res.json(response);
      } else {
        // Create Account
        var user = new User();
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        user.email = req.body.email;
        // Hash the password using SHA1 algorithm.
        user.password =  require('crypto')
          .createHash('sha1')
          .update(req.body.password)
          .digest('base64');

        user.save(function(err) {
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

router.route("/signin")
  .get(function(req, res) {
    res.render('account/signin',{title: 'weat: sign-in'});
  })
module.exports = router;
