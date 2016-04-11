var MenuManagementModel = function () {
    var self = this;
    // Properties
    self.currentMenuName = ko.observable();
    self.currentCategoryName = ko.observable();
    self.menus = ko.observableArray();
    self.newMenu = ko.observable(new MenuModel());
    self.newCategory = ko.observable(new CategoryModel());
    self.newFoodItem = ko.observable(new FoodItemModel());
    self.newMeal = ko.observable(new MealModel());
    self.currentMenu = ko.observable();
    self.currentCategory = ko.observable();
    self.currentFoodItem = ko.observable();
    self.currentMeal = ko.observable();


    // Initial Get Data
    self.fetchMenus = function () {
        $.post("/admin/fetchMenus", function (menus) {
            $('#menu-manager').fadeIn();
            menus.forEach(function (menu) {
                self.menus.push(new MenuModel(menu));
            });
        });
    };
    // Menu Methods
    self.createMenu = function () {
        if (self.newMenu().name()) {
            console.log(ko.toJSON(self.newCategory()));
            console.log(ko.toJSON(self.newMenu()));

            $.post("/admin/createMenu", {menu: ko.toJSON(self.newMenu())}, function (result) {
                console.log(result);
                if (result.error) {
                    alert('Error occurred. Please contact us at help@weat.com.')
                } else {
                    $('#create-menu-window').modal('hide');
                    self.newMenu().id(result.menuId);
                    self.menus.push(self.newMenu());
                    self.newMenu(new MenuModel());
                }
            });
        } else {
            alert('Please fill in name.');
        }
    };
    self.editMenu = function () {
        $.post("/admin/editMenu", {menu: ko.toJSON(self.currentMenu())}, function (result) {
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-menu-window').modal('hide');
            }
        });

    };
    self.deleteMenu = function () {
        $.post("/admin/deleteMenu", {menuId: self.currentMenu().id}, function (result) {
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-menu-window').modal('hide');
                self.menus.remove(function (item) {
                    return item.id() == self.currentMenu().id();
                });
                self.showAllMenus();
            }
        });
    };
    // Category Methods
    self.createCategory = function () {
        var currentMenuId = self.currentMenu().id();
        console.log(self.currentMenu());
        if (self.newCategory().name()) {
            $.post("/admin/createCategory", {
                category: ko.toJSON(self.newCategory()),
                menuId: currentMenuId.toString()
            }, function (result) {
                console.log(result);
                if (result.error) {
                    alert('Error occurred. Please contact us at help@weat.com.')
                } else {
                    $('#create-category-window').modal('hide');
                    self.newCategory().id(result.id);
                    self.currentMenu().categories.push(self.newCategory());
                    self.newCategory(new CategoryModel());
                }
            });
        } else {
            alert('Please fill in name.');
        }
    };
    self.editCategory = function () {
        $.post("/admin/editCategory", {category: ko.toJSON(self.currentCategory())}, function (result) {
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-category-window').modal('hide');
            }
        });
    };
    self.deleteCategory = function () {
        $.post("/admin/deleteCategory", {catId: self.currentCategory().id}, function (result) {
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-category-window').modal('hide');
                self.currentMenu().categories.remove(function (item) {
                    return item.id() == self.currentCategory().id();
                });
                self.showCurrentMenu();
            }
        });
    };
    // Food Item Methods
    self.createFoodItem = function () {
        var currentCategoryId = self.currentCategory().id();
        console.log(self.currentMenu());
        if (self.newFoodItem().name()) {
            $.post("/admin/createFoodItem", {
                foodItem: ko.toJSON(self.newFoodItem),
                categoryId: currentCategoryId.toString()
            }, function (result) {
                console.log(result);
                if (result.error) {
                    alert('Error occurred. Please contact us at help@weat.com.')
                } else {
                    $('#create-food-item-window').modal('hide');
                    console.log(result.itemId);
                    self.newFoodItem().id(result.itemId);
                    console.log(self.newFoodItem().id());
                    self.currentCategory().foodItems.push(self.newFoodItem());
                    self.newFoodItem(new FoodItemModel()); // Clear
                }
            });
        } else {
            alert('Please fill in name.');
        }
    };
    self.editFoodItem = function () {
        $.post("/admin/editFoodItem", {foodItem: ko.toJSON(self.currentFoodItem())}, function (result) {
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-food-item-window').modal('hide');
            }
        });
    };
    self.deleteFoodItem = function () {
        $.post("/admin/deleteFoodItem", {itemId: self.currentFoodItem().id}, function (result) {
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-food-item-window').modal('hide');
                self.currentCategory().foodItems.remove(function (item) {
                    return item.id() == self.currentFoodItem().id();
                });
            }
        });
    };
    // Meal Methods
    self.createMeal = function () {
        console.log(self.newMeal());
        var currentCategoryId = self.currentCategory().id();
        if (self.newMeal().name()) {
            console.log(self.newMeal());

            $.post("/admin/createMeal", {
                meal: ko.toJSON(self.newMeal),
                categoryId: currentCategoryId.toString()
            }, function (result) {
                console.log(result);
                if (result.error) {
                    alert('Error occurred. Please contact us at help@weat.com.')
                } else {
                    $('#create-meal-window').modal('hide');
                    console.log(result.mealId);
                    self.newMeal().id(result.mealId);
                    self.currentCategory().meals.push(self.newMeal());
                    self.newMeal(new MealModel()); // Clear
                }
            });
        } else {
            alert('Please fill in name.');
        }
    };
    self.editMeal = function () {
        $.post("/admin/editMeal", {meal: ko.toJSON(self.currentMeal())}, function (result) {
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-meal-window').modal('hide');
            }
        });
    };
    self.deleteMeal = function () {
        $.post("/admin/deleteMeal", {mealId: self.currentMeal().id}, function (result) {
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-meal-window').modal('hide');
                self.currentCategory().meals.remove(function (meal) {
                    return meal.id() == self.currentMeal().id();
                });
            }
        });
    };
    // Show/Hide View Methods
    self.showAllMenus = function () {
        self.currentCategory('');
        self.currentMenuName('');
        self.currentCategoryName('');
        self.currentMenu('');
        $('#all-menus').fadeIn();
    };
    self.showCurrentMenu = function () {
        $('#all-menus').hide();
        $('#food-item-manager').hide();
        self.currentCategoryName('');

        $('#all-categories').fadeIn();
    };
    self.showMenuView = function (menu) {
        $('#all-menus').hide();
        self.currentCategory('');
        self.currentCategoryName('');
        self.currentMenuName(menu.name());
        self.currentMenu(menu);
        $('#all-categories').fadeIn();
    };
    self.showCategoryView = function (category) {
        $('#all-categories').hide();
        self.currentCategoryName(category.name());
        self.currentCategory(category);
        $('#food-item-manager').fadeIn();
        $('.ui.dropdown').dropdown();
    };
    self.showFoodItemEditor = function (foodItem) {
        self.currentFoodItem(foodItem);
        $('#edit-food-item-window').modal('show');
    };
    self.showMealsEditor = function (meal) {
        self.currentMeal(meal);
        $('.ui.dropdown').dropdown();
        $('#edit-meal-window').modal('show');
    };
};

$(document).ready(function () {
    var manageModel = new MenuManagementModel();
    manageModel.fetchMenus();
    ko.applyBindings(manageModel, document.getElementById('menu-manager'));
});

function MenuModel(menu) {
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.isPublic = ko.observable(false);
    self.restaurantId = ko.observable();
    self.categories = ko.observableArray();
    self.fetchCategories = function (ids) {
        $.post("/admin/fetchCategories", {categoryIds: JSON.stringify(ids)}, function (categories) {
            categories.forEach(function (category) {
                self.categories.push(new CategoryModel(category));
            })
        });
    };
    // Initialize
    if (menu) {
        console.log(menu);
        self.id(menu._id);
        self.name(menu.name);
        self.isPublic(menu.isPublic);
        self.restaurantId(menu.restaurantId);
        if (menu.menuCategories.length > 0) {
            self.fetchCategories(menu.menuCategories);
        }
    }
}

function CategoryModel(category) {
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.description = ko.observable();
    self.restaurantId = ko.observable();
    self.foodItems = ko.observableArray();
    self.meals = ko.observableArray();
    self.fetchFoodItems = function (category, ids) {
        $.post("/admin/fetchFoodItems", {foodItemIds: JSON.stringify(ids)}, function (items) {
            items.forEach(function (item) {
                self.foodItems.push(new FoodItemModel(item));
            });
        });
    };
    self.fetchMeals = function (category, ids) {
        $.post("/admin/fetchMeals", {mealIds: JSON.stringify(ids)}, function (meals) {
            meals.forEach(function (meal) {
                self.meals.push(new MealModel(meal));
            });
        });
    };
    // Initialize
    if (category) {
        self.id(category._id);
        self.name(category.name);
        self.description(category.description);
        self.restaurantId(category.restaurantId);
        if (category.foodItems.length > 0) {
            self.fetchFoodItems(category, category.foodItems);
        }
        if (category.meals.length > 0) {
            self.fetchMeals(category, category.meals);
        }
    }
}

function FoodItemModel(item) {
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.price = ko.observable();
    self.available = ko.observable();
    self.description = ko.observable();
    self.imgPath = ko.observable();
    self.averagePrepTime = ko.observable();
    //self.restaurantId = restaurantId;
    // Initialize
    if (item) {
        self.id(item._id);
        self.name(item.name);
        self.price(item.price);
        self.available(item.available);
        self.description(item.description);
        self.imgPath = item.imgPath;
        self.averagePrepTime = item.averagePrepTime;
        //self.restaurantId = item.restaurantId;
    }
}

function MealModel(meal) {
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.price = ko.observable();
    self.available = ko.observable();
    self.description = ko.observable();
    self.imgPath = ko.observable();
    self.averagePrepTime = ko.observable();
    self.foodItems = ko.observableArray();
    //self.restaurantId = restaurantId;
    // Initialize
    if (meal) {
        self.id(meal._id);
        self.name(meal.name);
        self.price(meal.price);
        self.available(meal.available);
        self.description(meal.description);
        self.imgPath = meal.imgPath;
        self.averagePrepTime = meal.averagePrepTime;
        self.foodItems(meal.foodItems);
        //self.restaurantId = item.restaurantId;
    }
}