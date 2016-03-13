var restaurantId = "56c503be9bc2f4cc1396845e"; //HACK: fetch from logged-in account

// Templates for new objects
var Menu = {
    name: '',
    isPublic: false,
    restaurantId: restaurantId,
    menuCategories: []
};

var Category = {
    "name" : '',
    "description" : '',
    "imgPath" : '',
    "restaurantId" : restaurantId,
    "foodItems" : []
};

var FoodItem = {
    "name" : '',
    "price" : '',
    "available" : '',
    "description" : '',
    "imagePath" : '',
    "averagePrepTime" : '', // in minutes
    "restaurantId" : restaurantId
};

var MenuManagementModel = function() {
    var self = this;
    self.menus = ko.observableArray();
    self.newMenu = ko.observable(Menu);
    self.newCategory = ko.observable(Category);
    self.newFoodItem = ko.observable(FoodItem);
    self.currentMenu = ko.observable();
    self.currentCategory = ko.observable();
    self.fetchMenus = function() {
        $.post("/admin/fetchMenus", {restaurantId: restaurantId}, function(menus){
            self.menus(menus);
        });
    };

    self.createMenu = function() {
        if (self.newMenu().name) {
            console.log(ko.toJSON(self.newCategory()));
            console.log(ko.toJSON(self.newMenu()));

            $.post("/admin/createMenu", {menu: ko.toJSON(self.newMenu())}, function(result){
                console.log(result);
                if (result.error) {
                    alert('Error occurred. Please contact us at help@weat.com.')
                } else {
                    $('#create-menu-window').modal('hide')
                    self.newMenu()._id = result.menuId;
                    console.log(self.newMenu());
                    self.menus.push(self.newMenu());
                }
            });
        } else {
            alert('Please fill in name.');
        }
    };
    self.deleteMenu = function() {
        $.post("/admin/deleteMenu", {menuId: self.currentMenu().id}, function(result){
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                $('#edit-menu-window').modal('hide')
                self.menus.remove(function (item) {
                    console.log(item._id, self.currentMenu().id());
                    return item._id == self.currentMenu().id();
                });
                self.currentMenu('');
            }
        });
    };
    self.createCategory = function() {
        var currentMenuId = self.currentMenu().id();
        console.log(self.currentMenu());
        if (self.newCategory().name) {
            $.post("/admin/createCategory", {category: ko.toJSON(self.newCategory()), menuId: currentMenuId.toString()}, function(result){
                console.log(result);
                if (result.error) {
                    alert('Error occurred. Please contact us at help@weat.com.')
                } else {
                    $('#create-category-window').modal('hide')
                    self.currentMenu().categories.push(self.newCategory());
                }
            });
        } else {
            alert('Please fill in name.');
        }
    };
    self.createFoodItem = function() {
        var currentCategoryId = self.currentCategory().id();
        console.log(self.currentMenu());
        if (self.newFoodItem().name) {
            $.post("/admin/createFoodItem", {foodItem: ko.toJSON(self.newFoodItem()), categoryId: currentCategoryId.toString()}, function(result){
                console.log(result);
                if (result.error) {
                    alert('Error occurred. Please contact us at help@weat.com.')
                } else {
                    $('#create-food-item-window').modal('hide')
                    self.currentCategory().foodItems.push(self.newFoodItem());
                }
            });
        } else {
            alert('Please fill in name.');
        }
    };
    // Show/Hide Methods
    self.showMenuEditor = function(menu) {
        //$('#menu-editor').hide();
        self.currentCategory('');
        self.currentMenu(new MenuModel(menu));
    };
    self.showCategoryEditor = function(category) {
        //$('#category-editor').hide();
        self.currentCategory(category);
    };
};
$(document).ready(function(){
    var manageModel = new MenuManagementModel();
    manageModel.fetchMenus();
    ko.applyBindings(manageModel, document.getElementById('menu-manager'));
});


function MenuModel(menu){
    var self = this;
    self.id = ko.observable(menu._id);
    self.name = ko.observable(menu.name);
    self.isPublic = ko.observable(menu.isPublic);
    self.restaurantId = ko.observable(menu.restaurantId);
    self.categories = ko.observableArray();
    self.fetchCategories = function(ids) {
        $.post("/admin/fetchCategories", {categoryIds: JSON.stringify(ids)}, function(categories){
            categories.forEach(function (category) {
                self.categories.push(new CategoryModel(category));
            })
        });
    };
    // Initialize
    if (menu.menuCategories.length > 0) {
        self.fetchCategories(menu.menuCategories);
    }
}

function CategoryModel(category){
    var self = this;
    self.id = ko.observable(category._id);
    self.name = ko.observable(category.name);
    self.description = ko.observable(category.description);
    self.restaurantId = ko.observable(category.restaurantId);
    self.foodItems = ko.observableArray();
    self.fetchFoodItems = function(category, ids) {
        $.post("/admin/fetchFoodItems", {foodItemIds: JSON.stringify(ids)}, function(items){
            items.forEach(function(item){
                self.foodItems.push(item);
            });
        });
    };
    // Initialize
    self.fetchFoodItems(category, category.foodItems);
}


//function FoodItemModel(item){
//    self.name = item.name;
//}