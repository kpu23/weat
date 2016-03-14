/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var Menu = require('../models/menu');
var Categories = require('../models/menu-category');
var MealItems = require('../models/meal-item');
var FoodItems = require('../models/food-item');
var Order = require('../models/order');

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
  });


router.route("/restaurants/:restaurant").get(function(req,res) {
  var restaurantName = req.params.restaurant;
  var pageTitle = 'weat: ' + restaurantName;
  console.log("restname", restaurantName);

  //grab restaurant
  Restaurant.findOne({name: restaurantName}, function (error, restaurant){
    if(error) {
      console.log(error);
    }
    else {
      res.render("restaurant-menu", {title: pageTitle, restaurant: restaurant});
    }
  });
});

router.route("/restaurants/AddItemToOrder").post(function(req,res,next) {
  console.log("Add Item to Order");

  //req.session.order = null;

  var itemId = req.body.itemId;
  var restaurantId = req.body.restaurantId;
  var quantity = req.body.quantity;
  var instructions = req.body.instructions;


  if(itemId && restaurantId)
  {
    //check if order exists
      if(req.session.order != null)
      {
        console.log("here");

        if(restaurantId != req.session.order.restaurantId)
        {
          var response = {success: false, message: "new restaurant"};
          res.send(response);
        }
        else
        {
          for(var i = 0; i < quantity; i++)
          {
            req.session.order.itemIds.push(itemId);
            req.session.order.items.push({itemId: itemId, instructions: instructions});
          }

          var response = {success: true, message: "item added to existing order"};

          console.log(req.session);

          res.send(response);
        }
      }
      //make new order
      else
      {
        var order = new Order();
        order.restaurantId = restaurantId;
        for(var i = 0; i < quantity; i++)
        {
          order.itemIds.push(itemId);
          order.items.push({itemId: itemId, instructions: instructions});
        }
        req.session.order = order;
        var response = {success: true, message: "item added to new order"};
        console.log(req.session);
        res.send(response);
      }
      
  }
  
  
});


module.exports = router;
