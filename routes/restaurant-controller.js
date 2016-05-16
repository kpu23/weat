/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var Menu = require('../models/menu');
var Categories = require('../models/menu-category');
var MealItems = require('../models/meal');
var FoodItems = require('../models/food-item');
var Order = require('../models/order');

router.route("/restaurants")
    .get(function(req,res) {
        var pageTitle = 'weat: all restaurants';

        if(typeof(req.query.q) != "undefined")
        {
            console.log("get request: " + req.query.q);
            var searchTerm = req.query.q.toLowerCase();

            Restaurant.find( {$or: [{name: searchTerm}, {foodtype: searchTerm}, {displayName: searchTerm}]}, function (error, results){
                if(error){
                    return console.error(error);
                }
                else if(results)
                {
                    console.log("Results: ");
                    console.log(results);
                    console.log(typeof(results));
                    res.render('Restaurants.ejs',{title: pageTitle, restaurants: results});
                }
            });
        }
        else
        {
            Restaurant.find(function (error, results){
                if(error){
                    return console.error(error);
                }
                else
                {
                    console.log("Results: ");
                    console.log(results);
                    res.render('Restaurants.ejs',{title: pageTitle, restaurants: results});
                }
            });
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
            res.render("restaurant-menu.ejs", {title: pageTitle, restaurant: restaurant});
        }
    });
});

router.route("/restaurants/AddItemToOrder").post(function(req, res) {
    var itemId = req.body.itemId;
    var restaurantId = req.body.restaurantId;
    var quantity = req.body.quantity;
    var instructions = req.body.instructions;
    var price = req.body.price;
    var name = req.body.name;

    console.log('HELLO');
    console.log(price);
    if(itemId && restaurantId) {
        // Create new order if not exists
        if (!req.session.order) {
            var order = {};
            order.restaurantId = restaurantId;
            order.items = [];
            req.session.order = order;
        } else {
            // Break out if trying to start an order from a new restaurant
            if (restaurantId != req.session.order.restaurantId) {
                var response = {success: false, message: "new restaurant"};
                res.send(response);
            }
        }
        for (var i = 0; i < quantity; i++) {
            console.log(price);
            req.session.order.items.push({itemId: itemId, instructions: instructions, name: name, price: price});
            console.log(req.session.order.items);
        }
        res.send({success: true, message: "item added to new order"});
    }
});

module.exports = router;
