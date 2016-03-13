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

  /*menuObject = {
    restaurant: [
      menus: [
        categories: [
          foodItems: []
          mealItems: []
          ]
        ]
      ]
  };*/

  menuObject = {};


  var restaurantName = req.params.restaurant;
  var pageTitle = 'weat: ' + restaurantName;
  console.log("restname", restaurantName);

  //grab restaurant
  Restaurant.findOne({name: restaurantName}, function (error, restaurant){
    if(error)
    {
      console.log(error);
    }
    else
    {
      menuObject.restaurant = restaurant;
      //console.log("menuObject - Step 1 - Restaurant", menuObject);

      Menu.find({restaurantId: restaurant._id}).lean().exec(function (error, menus){
        //menuObject.menus = [];
        //console.log("menuObject - Step 2 - Add Array to Restaurant", menuObject);
        
        if(error){console.log(error);}
        else
        {
          console.log("menu", menus);
          //menuObject.menus.push(["test", "array"]);

          menuObject.menus = menus
          //console.log("menuObject - Step 2 - Add Menus", menuObject);
          //loop through menus

          i = 0;
          fetchCategories(menus, menuObject, i, function(){
            console.log("categories async loop done!");
            j = 0;
            console.log(menuObject);
            res.render("restaurant-menu", {title: pageTitle, restaurant: menuObject.restaurant, menus: menuObject.menus});
            /*fetchFoodItems(menus, menuObject, j, function(){
              console.log("food items async loop done!")
              console.log(menuObject.menus[0].categories);
            });*/
            //console.log(menuObject.menus[0]);
          });
        }        
      });
    }
  });
});

function fetchCategories(menus, menuObject, counter, callback)
{
  
  if(counter < menus.length)
  {
   // menus.forEach(function(menu){

    console.log(counter);
      Categories.find({_id: {$in: menus[counter].menuCategories}}).lean().exec(function (error, categories)
      {

          menuObject.menus[counter].categories = categories;
          counter++;
          fetchCategories(menus, menuObject, counter, callback);
      });
   
   // });
    
  }
  else
  {
    console.log("counter >= length -- leaving fetch categories function...");
    callback();
  }
}

/*
    Not being used currently
*/
function fetchFoodItems(menus, menuObject, counter, callback)
{
  i = 0;

    if(counter < menuObject.menus[i].categories.length)
    {
      FoodItems.find({_id: {$in: menuObject.menus[i].categories[counter].foodItems}}).lean().exec(function (error, foodItems){
        menuObject.menus[i].categories[counter].foodItemsArray = foodItems;
        counter++;
        fetchFoodItems(menus, menuObject, counter, callback);
      });
    }
    else
    {
      console.log("counter >= length -- leaving fetch food items function...");
      callback();
    }
}

router.route("/restaurants/fetchItemsIdArray").post(function(req,res,next) {
  var catId = req.body.categoryId;
  console.log(catId);
  if(catId)
  {
    Categories.findOne({_id: catId}).lean().exec(function (error, categories)
    {
      res.send(categories.foodItems);
    });  
  }
  
});

router.route("/restaurants/fetchFoodItems").post(function(req,res,next) {
  console.log("Fetch Food Items");
  var foodItemsIdArray = JSON.parse(req.body.foodItemsIdArray);
  FoodItems.find({_id: {$in: foodItemsIdArray }}).lean().exec(function (error, foodItems)
  {
    console.log(req.session);
    res.send(foodItems);
  });
});

router.route("/restaurants/AddItemToOrder").post(function(req,res,next) {
  console.log("Add Item to Order");

  //req.session.order = null;

  var itemId = req.body.itemId;
  var restaurantId = req.body.restaurantId;

  if(itemId && restaurantId)
  {
    //check if order exists
      if(req.session.order != null)
      {
        if(restaurantId != req.session.order.restaurantId)
        {
          var response = {success: false, message: "new restaurant"};
          res.send(response);
        }
        else
        {
          req.session.order.items.push(itemId);
          var response = {success: true, message: "item added to existing order"};

          console.log(req.session);

          res.send(response);
        }
      }
      //make new order
      else
      {
        var order = new Order();
        order.userId = req.session.user._id;
        order.restaurantId = restaurantId;
        order.items = []; order.items.push(itemId);
        req.session.order = order;
        var response = {success: true, message: "item added to new order"};
        res.send(response);
      }
      
  }
  
  
});


module.exports = router;
