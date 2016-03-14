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

	if(req.session.user.restaurantId)
	{
		//_id: req.body.restaurantId
		//name: "Default"
		Menu.find({restaurantId: req.session.user.restaurantId}, function (error, menu){
			if(error){
                console.log(error);
            }
			else {
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
	menu.restaurantId = req.session.user.restaurantId;
	menu.menuCategories = data.categories;

	menu.save(function(err, result) {
		// save() will run insert() command of MongoDB.
		// it will add new data in collection.
		if (err) {
			response = {"error": true, "message": "Error adding data"};
		} else {
			response = {"error": false, "message": "Menu added successfully.", menuId: result._id};
		}
		res.json(response);
	});
});
router.post('/admin/deleteMenu', function(req, res) {
    var menuId = req.body.menuId;
    var response = {};
    console.log(menuId);
    // Delete Menu
    Menu.findById(menuId, function (error, menu) {
        if (menu) {
            Category.find({_id: {$in: menu.menuCategories}}, function (error, categories){
                if(error) {
                    response = {"error": true, "message": "Error querying categories."};
                    console.log(error);
                } else {
                    if (categories.length > 0) {
                        categories.forEach(function (category) {
                            // Delete Food Items
                            FoodItem.find({_id: {$in: category.foodItems}}).remove(function(error) {
                                if (error) {
                                    response = {"error": true, "message": "Error deleting food items."};
                                    console.log(error);
                                }
                            });
                        });
                    }
                }
            }).remove(function(error) {
                if (error) {
                    response = {"error": true, "message": "Error deleting categories."};
                    console.log(error);                    }
            });
            menu.remove(function (error) {
                if (error) {
                    response = {"error": true, "message": "Error deleting menu."};
                    console.log(error);
                } else {
                    response = {"error": false, "message": "Menu added successfully."};
                }
            });
        } else {
            response = {"error": false, "message": "Could not find menu."};
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
            res.json(response);
        } else {
            Menu.findById(menuId, function (error, menu){
                if(error) {
                    console.log('mongoose error')
                    console.log(error);
                } else {
                    console.log(menu);
                    menu.menuCategories.push(result._id);
                    menu.save();
                    response = {"error": false, "message": "Category added to menu successfully.", id: result._id};
                    res.json(response);
                }
            });
        }
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
    if (!data.imgPath) {
      data.imgPath = '/images/placeholder-item-img.png';
    }
    foodItem.imgPath = data.imgPath;
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