var MenuManagementModel = function () {
    var self = this;
    // Properties
    self.currentMenuName = ko.observable();
    self.currentCategoryName = ko.observable();
    self.menus = ko.observableArray();
    self.newMenu = ko.observable(new MenuModel());
    self.newCategory = ko.observable(new CategoryModel());
    self.newFoodItem = ko.observable(new FoodItemModel());
    self.currentMenu = ko.observable();
    self.currentCategory = ko.observable();
    self.currentFoodItem = ko.observable();

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
    };
    self.showFoodItemEditor = function (foodItem) {
        self.currentFoodItem(foodItem);
        $('#edit-food-item-window').modal('show');
    }
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
    self.fetchFoodItems = function (category, ids) {
        $.post("/admin/fetchFoodItems", {foodItemIds: JSON.stringify(ids)}, function (items) {
            items.forEach(function (item) {
                self.foodItems.push(new FoodItemModel(item));
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