var restaurantId = "56c503be9bc2f4cc1396845e"; //HACK: fetch from logged-in account

var Menu = {
    name: '',
    isPublic: false,
    restaurantId: restaurantId,
    categories: []
};

var Category = {
    "name" : '',
    "description" : '',
    "imgPath" : '',
    "restaurantId" : restaurantId,
    "foodItems" : []
}

var FoodItem = {
    "name" : '',
    "price" : '',
    "available" : '',
    "description" : '',
    "imagePath" : '',
    "averagePrepTime" : '', // in minutes
    "restaurantId" : restaurantId
}

var MenuManagementModel = function() {
    var self = this;
    self.menus = ko.observableArray();
    self.newMenu = ko.observable(Menu);
    self.currentMenu = ko.observable();
    self.fetchMenus = function() {
        $.post("/admin/fetchMenus", {restaurantId: restaurantId}, function(menus){
            self.menus(menus);
        });
    };

    self.createMenu = function() {
        if (self.newMenu().name) {
            $.post("/admin/createMenu", {menu: ko.toJSON(self.newMenu())}, function(result){
                console.log(result);
                if (result.error) {
                    alert('Error occurred. Please contact us at help@weat.com.')
                } else {
                    $('#create-menu-section').modal('hide')
                    self.menus.push(self.newMenu());
                }
            });
        } else {
            alert('Please fill in name.');
        }
    };

    // Show/Hide Methods
    self.showMenuEditor = function(menu) {
        console.log(menu);
        //console.log(new MenuModel(menu));
        self.currentMenu(new MenuModel(menu));
    }
};
$(document).ready(function(){
    var manageModel = new MenuManagementModel();
    manageModel.fetchMenus();
    ko.applyBindings(manageModel, document.getElementById('menu-manager'));
});


function MenuModel(menu){
    var self = this;
    self.categories = ko.observableArray();
    self.fetchCategories = function(ids) {
        $.post("/admin/fetchCategories", {categoryIds: JSON.stringify(ids)}, function(categories){
            console.log(categories);
            categories.forEach(function (category) {
                console.log(category.foodItems);
                self.categories.push(new CategoryModel(category));
            })
        });
    };
    // Initialize
    self.fetchCategories(menu.menuCategories);
}

function CategoryModel(category){
    var self = this;
    self.foodItems = ko.observableArray();
    self.fetchFoodItems = function(category, ids) {
        $.post("/admin/fetchFoodItems", {foodItemIds: JSON.stringify(ids)}, function(items){
            console.log(items);
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