/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var Menu = require('../models/menu');
var Category = require('../models/menu-category');
var FoodItem = require('../models/food-item');
var Order = require('../models/order');
var Meal = require('../models/meal');

// Admin Home
router.get('/admin', function (req, res) {
    res.render('Admin_Home.ejs', {title: 'weat: home'});
});

// Menu Manager
router.get('/menu_manager', function (req, res) {
    res.render('Menu_Manager.ejs', {title: 'weat: admin panel'});
});

// Live Feed
router.get('/live_feed', function (req, res) {
    res.render('Live_feed.ejs', {title: 'weat: live feed'});
});

// View Customers
router.get('/view_customers', function (req, res) {
    res.render('View_Customers.ejs', {title: 'weat: View Customers'});
});

// Fetch Menus, Categories, Food Items
router.post('/admin/fetchMenus', function (req, res) {
    var restaurantId;
    if (req.body.restaurantId) {
        restaurantId = req.body.restaurantId
    }
    else if (req.session.user.restaurantId) {
        restaurantId = req.session.user.restaurantId
    }

    if (restaurantId) {
        console.log(restaurantId);
        Menu.find({restaurantId: restaurantId}, function (error, menu) {
            if (error) {
                console.log(error);
            }
            else {
                res.send(menu);
            }
        });
    }
});
router.post('/admin/fetchCategories', function (req, res) {
    console.log(JSON.parse(req.body.categoryIds));
    var categoryIds = JSON.parse(req.body.categoryIds);
    if (categoryIds) {
        Category.find({_id: {$in: categoryIds}}, function (error, categories) {
            if (error) {
                console.log(error);
            }
            else {
                res.send(categories);
            }
        });
    }
    else {
        console.log("returning null");
        res.send(null);
    }
});
router.post('/admin/fetchFoodItems', function (req, res) {

    console.log(JSON.parse(req.body.foodItemIds));

    var foodItemIds = JSON.parse(req.body.foodItemIds);
    if (foodItemIds) {
        FoodItem.find({_id: {$in: foodItemIds}}, function (error, foodItems) {
            if (error) {
                console.log(error);
            } else {
                console.log(foodItems);
                res.send(foodItems);
            }
        });
    } else {
        console.log("returning null");
        res.send(null);
    }
});
router.post('/admin/fetchMeals', function (req, res) {
    console.log(JSON.parse(req.body.mealIds));
    var mealIds = JSON.parse(req.body.mealIds);
    if (mealIds) {
        Meal.find({_id: {$in: mealIds}}, function (error, meals) {
            if (error) {
                console.log(error);
            } else {
                console.log(meals);
                res.send(meals);
            }
        });
    } else {
        res.send(null);
    }
});

// Create, Edit, Delete Methods
router.post('/admin/createMenu', function (req, res) {
    var data = JSON.parse(req.body.menu);
    console.log(data);
    var response = {};
    // Create Menu
    var menu = new Menu();
    menu.name = data.name;
    menu.isPublic = data.isPublic;
    menu.restaurantId = req.session.user.restaurantId;
    menu.menuCategories = data.categories;

    menu.save(function (err, result) {
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
router.post('/admin/editMenu', function (req, res) {
    var data = JSON.parse(req.body.menu);
    console.log('edit', data);
    var response = {};
    // Delete Menu
    Menu.findById(data.id, function (error, menu) {
        if (menu) {
            menu.name = data.name;
            menu.isPublic = data.isPublic;
            menu.save();
        } else {
            response = {"error": false, "message": "Could not find menu."};
        }
        res.json(response);
    });
});
router.post('/admin/deleteMenu', function (req, res) {
    var menuId = req.body.menuId;
    var response = {};
    console.log(menuId);
    // Delete Menu
    Menu.findById(menuId, function (error, menu) {
        if (menu) {
            Category.find({_id: {$in: menu.menuCategories}}, function (error, categories) {
                if (error) {
                    response = {"error": true, "message": "Error querying categories."};
                    console.log(error);
                } else {
                    if (categories.length > 0) {
                        categories.forEach(function (category) {
                            // Delete Food Items
                            FoodItem.find({_id: {$in: category.foodItems}}).remove(function (error) {
                                if (error) {
                                    response = {"error": true, "message": "Error deleting food items."};
                                    console.log(error);
                                }
                            });
                        });
                    }
                }
            }).remove(function (error) {
                if (error) {
                    response = {"error": true, "message": "Error deleting categories."};
                    console.log(error);
                }
            });
            menu.remove(function (error) {
                if (error) {
                    response = {"error": true, "message": "Error deleting menu."};
                    console.log(error);
                } else {
                    response = {"error": false, "message": "Menu deleted successfully."};
                }
            });
        } else {
            response = {"error": false, "message": "Could not find menu."};
        }

        res.json(response);
    });
});
router.post('/admin/createCategory', function (req, res) {
    var data = JSON.parse(req.body.category);
    var menuId = req.body.menuId;
    var response = {};
    // Create Category
    var category = new Category();
    category.name = data.name;
    category.description = data.description;
    category.save(function (err, result) {
        if (err) {
            response = {"error": true, "message": "Error adding data"};
            res.json(response);
        } else {
            Menu.findById(menuId, function (error, menu) {
                if (error) {
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
router.post('/admin/editCategory', function (req, res) {
    var data = JSON.parse(req.body.category);
    console.log('edit', data);
    var response = {};
    // Edit Cat
    Category.findById(data.id, function (error, category) {
        if (category) {
            category.name = data.name;
            category.description = data.description;
            category.imgPath = data.imgPath;
            category.save();
            response = {"error": false};
        } else {
            response = {"error": true, "message": "Could not find category."};
        }
        res.json(response);
    });
});
router.post('/admin/deleteCategory', function (req, res) {
    var catId = req.body.catId;
    var response = {};
    console.log(catId);
    // Delete Menu
    Category.findById(catId, function (error, cat) {
        if (cat) {
            // Delete Food Items
            FoodItem.find({_id: {$in: cat.foodItems}}).remove(function (error) {
                if (error) {
                    response = {"error": true, "message": "Error deleting food items."};
                    console.log(error);
                }
            });
            cat.remove(function (error) {
                if (error) {
                    response = {"error": true, "message": "Error deleting category."};
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
router.post('/admin/createFoodItem', function (req, res) {
    var data = JSON.parse(req.body.foodItem);
    var categoryId = req.body.categoryId;
    var response = {};
    // Create Food Item
    var foodItem = new FoodItem();
    foodItem.name = data.name;
    foodItem.price = data.price;
    foodItem.available = data.available;
    foodItem.description = data.description;
    if (!data.imgPath) {
        data.imgPath = '/images/placeholder-item-img.png';
    }
    foodItem.imgPath = data.imgPath;
    foodItem.save(function (err, result) {
        if (err) {
            response = {"error": true, "message": "Error adding data"};
        } else {
            Category.findById(categoryId, function (error, category) {
                if (error) {
                    console.log(error);
                    response = {"error": true, "message": "Item creation failed."};
                } else {
                    category.foodItems.push(result._id);
                    category.save();
                    response = {"error": false, "message": "Item added to category successfully.", itemId: result._id};
                }
                res.json(response);
            });
        }
    });
});
router.post('/admin/editFoodItem', function (req, res) {
    var data = JSON.parse(req.body.foodItem);
    console.log('edit', data);
    var response = {};
    // Edit FoodItem
    FoodItem.findById(data.id, function (error, category) {
        if (category) {
            category.name = data.name;
            category.price = data.price;
            category.available = data.available;
            category.description = data.description;
            category.imgPath = data.imgPath;
            category.averagePrepTime = data.averagePrepTime;
            category.save();
            response = {"error": false};
        } else {
            response = {"error": true, "message": "Could not find food item."};
        }
        res.json(response);
    });
});
router.post('/admin/deleteFoodItem', function (req, res) {
    var itemId = req.body.itemId;
    var response = {};
    console.log(itemId);
    // Delete Food Items
    FoodItem.findById(itemId, function (error, item) {
        item.remove(function (error) {
            if (error) {
                response = {"error": true, "message": "Error deleting food item."};
                console.log(error);
            } else {
                response = {"error": false, "message": "Deleted successfully"};
            }
        });
    });
    res.json(response);
});
router.post('/admin/createMeal', function (req, res) {
    var data = JSON.parse(req.body.meal);
    console.log(data);
    var categoryId = req.body.categoryId;
    var response = {};
    // Create Meal
    var meal = new Meal();
    meal.name = data.name;
    meal.available = data.available;
    meal.price = data.price;
    meal.description = data.description;
    if (!data.imgPath) {
        data.imgPath = '/images/placeholder-item-img.png';
    }
    meal.imgPath = data.imgPath;
    meal.foodItems = data.foodItems;
    meal.save(function (err, result) {
        if (err) {
            console.log(err);
            response = {"error": true, "message": "Error adding data"};
            res.json(response);
        } else {
            Category.findById(categoryId, function (error, category) {
                if (error) {
                    console.log(error);
                    response = {"error": true, "message": "Meal creation failed."};
                } else {
                    category.meals.push(result._id);
                    category.save();
                    response = {"error": false, "message": "Meal added to category successfully.", mealId: result._id};
                }
                res.json(response);
            });
        }
    });
});
router.post('/admin/editMeal', function (req, res) {
    var data = JSON.parse(req.body.meal);
    var response = {};
    // Edit Meal
    Meal.findById(data.id, function (error, meal) {
        if (meal) {
            meal.name = data.name;
            meal.price = data.price;
            meal.available = data.available;
            meal.description = data.description;
            meal.imgPath = data.imgPath;
            meal.averagePrepTime = data.averagePrepTime;
            meal.foodItems = data.foodItems;
            meal.save();
            response = {"error": false};
        } else {
            response = {"error": true, "message": "Could not find food item."};
        }
        res.json(response);
    });
});
router.post('/admin/deleteMeal', function (req, res) {
    var mealId = req.body.mealId;
    var response = {};
    console.log(mealId);
    // Delete Food Items
    Meal.findById(mealId, function (error, meal) {
        meal.remove(function (error) {
            if (error) {
                response = {"error": true, "message": "Error deleting meal."};
                console.log(error);
            } else {
                response = {"error": false, "message": "Deleted successfully"};
            }
        });
        res.json(response);
    });
});


router.get('/admin/fetchLiveOrders', function (req, res) {
    console.log('fetch orders ', req.session);
    if (req.session) {
        var restaurantId = req.session.user.restaurantId;
        if (restaurantId) {
            Order.find({status: 'Pending'}, function (error, orders) {
                if (error) {
                    console.log(error);
                    res.send(null);
                } else {
                    console.log("oorders", orders);
                    res.send(orders);
                }
            });
        } else {
            res.send(null);
        }
    }

});

// router.get('/admin/fetchOrderHistory', function (req, res) {
//     console.log('fetch orders ', req.session);
//     if (req.session) {
//         var restaurantId = req.session.user.restaurantId;
//         if (restaurantId) {
//             Order.find({status: {$ne: 'Pending'}}, function (error, orders) {
//                 if (error) {
//                     console.log(error);
//                     res.send(null);
//                 } else {
//                     console.log("history orders", orders);
//                     res.send(orders);
//                 }
//             });
//         } else {
//             res.send(null);
//         }
//     }

// });

router.post('/admin/updateOrderStatus', function (req, res) {
    if (req.session) {
        var newStatus = req.body.status;
        var orderId = req.body.orderId;
        if (newStatus && orderId) {
            Order.findOne({_id: orderId}, function (error, order) {
                if (error) {
                    console.log(error);
                    res.send("failed");
                } else {
                    order.status = newStatus
                    order.save();
                    res.send("success");
                }
            });
        } else {
            res.send(null);
        }
    }

});

module.exports = router;