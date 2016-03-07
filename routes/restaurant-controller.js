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
          
              
              /*Categories.find({_id: {$in: menu[0].menuCategories}}).lean().exec(function (error, categories){
              if(error)
              {
                console.log(error);
              }
              else
              {

              }
            });*/
        }

        
      });

        //console.log("menuObject - Step 3 - Add Categories to Menus", menuObject);
        //console.log("DDDDDDDDDDDDDd");
        //res.render("restaurant-menu", {title: pageTitle, restaurant: menuObject.restaurant, menus: menuObject.menus});
      
    }
  });

      /*Categories.find({restaurantId: restaurant._id}, function (error, categories){
        if(error)
        {
          console.log(error);
        }
        else
        {
          for(i = 0; i < categories.length; i++)
          {
            FoodItems.find({_id: { $in: categories[i].foodItems}}, function (error, items){
              if(error)
              {
                console.log(error);
              }
              else
              {
                if(typeof(items) != "undefined")
                { 
                  console.log(i); //foodItemsArray); // = items;
                  console.log(items);
                  console.log("categories:");
                  console.log(categories);

                }
               
                
                
              }
            });

          }
          //FoodItems.find( {_id: categories.}, )
          res.render("restaurant-menu", {title: pageTitle, restaurant: restaurant, categories: categories});
        }
      });
    }
  });*/

  //grab menu




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
  


module.exports = router;
