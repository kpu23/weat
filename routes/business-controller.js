/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var Menu = require('../models/menu');
var Categories = require('../models/menu-category');
var MealItems = require('../models/meal-item');
var FoodItems = require('../models/food-item');

/* My restaurants page */
router.get('/admin', function(req, res, next) {
	//TODO we should handle renderings for customer home page, admin home page, and guest home page in the "/" (root) route
    res.render('admin_home',{title: 'weat: home'});
});

/* GET admin page. */
router.get('/menu_manager', function(req, res, next) {
    res.render('menu_manager',{title: 'weat: admin panel'});
});

router.post('/admin/fetchMenus', function(req, res, next){

//Fetch menus, fetch categories, fetch items

	if(req.body.restaurantId)
	{
		//_id: req.body.restaurantId
		//name: "Default"
		Menu.find({restaurantId: req.body.restaurantId}, function (error, menu){
			if(error){console.log(error);}
			else
			{
				//Categories.find({_id: $in: menu.})
				console.log(menu);
				res.send(menu);
			}
		});
	}
});

router.post('/admin/fetchCategories', function(req, res, next){
	console.log(JSON.parse(req.body.categoryIds));
	categoryIds = JSON.parse(req.body.categoryIds)
	if(categoryIds)
	{
		Categories.find({_id: {$in: categoryIds}}, function (error, categories){
			if(error){console.log(error);}
			else
			{
				console.log(categories);
				res.send(categories);

			}
		});
	}
	else
	{
		console.log("returning null");
		res.send(null);
	}
});


router.post('/admin/fetchFoodItems', function(req, res, next){

	console.log(JSON.parse(req.body.foodItemIds));

	foodItemIds = JSON.parse(req.body.categoryIds)
	if(foodItemIds)
	{
		FoodItems.find({_id: {$in: foodItemIds}}, function (error, foodItems){
			if(error){console.log(error);}
			else
			{
				console.log(foodItems);
				res.send(foodItems);
			}
		});
	}
	else
	{
		console.log("returning null");
		res.send(null);
	}
});

module.exports = router;