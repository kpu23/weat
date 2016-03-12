/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var Menu = require('../models/menu');
var Category = require('../models/menu-category');
var FoodItem = require('../models/food-item');

/* My restaurants page */
router.get('/admin', function(req, res, next) {
	//TODO we should handle renderings for customer home page, admin home page, and guest home page in the "/" (root) route
    res.render('admin_home',{title: 'weat: home'});
});

/* admin page. */
router.get('/menu_manager', function(req, res, next) {
    res.render('menu_manager',{title: 'weat: admin panel'});
});

/* Live Feed */
router.get('/live_feed', function(req, res, next) {
    res.render('live_feed',{title: 'weat: live feed'});
});

/* Marketing and analytics */
router.get('/marketing_analytics', function(req, res, next) {
    res.render('marketing_analytics',{title: 'weat: Marketing & Analytics'});
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
				//Category.find({_id: $in: menu.})
				res.send(menu);
			}
		});
	}
});

router.post('/admin/createMenu', function(req, res) {
    var data = JSON.parse(req.body.menu);
    console.log(data);
	var response = {};
	// Create Menu
	var menu = new Menu();
	menu.name = data.name;
	menu.isPublic = data.isPublic;
	menu.restaurantId = data.restaurantId;
	menu.menuCategories = data.categories;

	menu.save(function(err) {
		// save() will run insert() command of MongoDB.
		// it will add new data in collection.
		if (err) {
			response = {"error": true, "message": "Error adding data"};
		} else {
			response = {"error": false, "message": "Menu added successfully."};
		}
		res.json(response);
	});
});
router.post('/admin/createCategory', function(req, res) {
    var data = JSON.parse(req.body.category);
    var menuId = req.body.menuId;
    var response = {};
    // Create Category
    var category = new Category();
    category.name = data.name;
    category.description = data.description;
    category.save(function(err, result) {
        if (err) {
            response = {"error": true, "message": "Error adding data"};
        } else {
            Menu.findById(menuId, function (error, menu){
                if(error) {
                    console.log('mongoose error')
                    console.log(error);
                } else {
                    console.log(menu);
                    menu.menuCategories.push(result._id);
                    menu.save();
                    response = {"error": false, "message": "Category added to menu successfully."};
                }
            });
        }
        res.json(response);
    });
});
router.post('/admin/createFoodItem', function(req, res) {
    var data = JSON.parse(req.body.foodItem);
    var categoryId = req.body.categoryId;
    var response = {};
    // Create Category
    var foodItem = new FoodItem();
    foodItem.name = data.name;
    foodItem.price = data.price;
    foodItem.description = data.description;
    foodItem.save(function(err, result) {
        if (err) {
            response = {"error": true, "message": "Error adding data"};
        } else {
            Category.findById(categoryId, function (error, category){
                if(error) {
                    console.log('mongoose error')
                    console.log(error);
                } else {
                    console.log(category);
                    category.foodItems.push(result._id);
                    category.save();
                    response = {"error": false, "message": "Item added to category successfully."};
                }
            });
        }
        res.json(response);
    });
});


router.post('/admin/fetchCategories', function(req, res){
	console.log(JSON.parse(req.body.categoryIds));
	var categoryIds = JSON.parse(req.body.categoryIds)
	if(categoryIds)
	{
		Category.find({_id: {$in: categoryIds}}, function (error, categories){
			if(error){console.log(error);}
			else
			{
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


router.post('/admin/fetchFoodItems', function(req, res){

	console.log(JSON.parse(req.body.foodItemIds));

	var foodItemIds = JSON.parse(req.body.foodItemIds);
	if(foodItemIds)	{
		FoodItem.find({_id: {$in: foodItemIds}}, function (error, foodItems){
			if(error){
				console.log(error);
			} else {
				res.send(foodItems);
			}
		});
	}	else {
		console.log("returning null");
		res.send(null);
	}
});

module.exports = router;