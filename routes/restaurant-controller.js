/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var Categories = require('../models/menu-category');
var MealItems = require('../models/meal-item');

router.route("/restaurants")
  .get(function(req,res) {
    var pageTitle = 'weat: all restaurants';

    if(typeof(req.query.q) != "undefined")
    {
      console.log("get request: " + req.query.q);
      var searchTerm = req.query.q.toLowerCase();

      Restaurant.find( {status: true, $or: [{name: searchTerm}, {foodtype: searchTerm}, {displayName: searchTerm}]}, function (error, results){
        if(error){
          return console.error(error);
        } 

        //not sure how to check if empty...
        
        if(results)
        {
          console.log("Results: ");
          console.log(results);
          console.log(typeof(results));
          res.render('Restaurants',{title: pageTitle, restaurants: results});
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
          res.render('Restaurants',{title: pageTitle, restaurants: results});
        }
      });
      //console.log(restaurants);
      
    }
    
    
    //restaurants = [{name: "TESST"},{name: "TESST2"}];
   
  });


router.route("/restaurants/:restaurant")
  .get(function(req,res) {
  var restaurantName = req.params.restaurant;
  var pageTitle = 'weat: ' + restaurantName;
  console.log("restname", restaurantName);

  //grab restaurant
  Restaurant.findOne({name: restaurantName}, function (error, restaurant){
    if(error)
    {
      //console.log(error);
    }
    else
    {
      console.log("here: ");
      console.log(restaurant);
      console.log(restaurant._id);

      Categories.find({restaurantId: restaurant._id}, function (error, categories){
        if(error)
        {
          console.log(error);
        }
        else
        {

          console.log("categories: " );
          console.log(categories);
          res.render("restaurant-menu", {title: pageTitle, restaurant: restaurant});
        }
        
      });
      console.log(result);
      //console.log(result[0]);
      res.render("restaurant-menu", {title: pageTitle, restaurant: result});
    }
  });

  //grab menu




});


module.exports = router;
