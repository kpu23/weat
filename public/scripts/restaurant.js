/**
 * Created by Ben on 2/24/2016.
 */
'use strict';
//var restaurantId = "56c503be9bc2f4cc1396845e"; //HACK: fetch from logged-in account (Wahoos)
var restaurantId = $("#restaurant-id").data("restaurant-id");

function MenuModel(menu){
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.isPublic = ko.observable();
    self.restaurantId = ko.observable();
    self.categories = ko.observableArray();
    self.fetchCategories = function(ids) {
        $.post("/admin/fetchCategories", {categoryIds: JSON.stringify(ids)}, function(categories){
            categories.forEach(function (category) {
                self.categories.push(new CategoryModel(category));
            })
        });
    };
    // Initialize
    if (menu) {
        self.id(menu._id);
        self.name(menu.name);
        self.isPublic(menu.isPublic);
        self.restaurantId(menu.restaurantId);
        if (menu.menuCategories.length > 0) {
            self.fetchCategories(menu.menuCategories);
        }
    }
}

function CategoryModel(category){
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.description = ko.observable();
    self.restaurantId = ko.observable();
    self.foodItems = ko.observableArray();
    self.fetchFoodItems = function(category, ids) {
        $.post("/admin/fetchFoodItems", {foodItemIds: JSON.stringify(ids)}, function(items){
            items.forEach(function(item){
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

function FoodItemModel(item){
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.price = ko.observable();
    self.available = ko.observable();
    self.description = ko.observable();
    self.imgPath = ko.observable();
    self.averagePrepTime = ko.observable();
    self.restaurantId = restaurantId;
    // Initialize
    if (item) {
        self.id(item._id);
        self.name(item.name);
        self.price(item.price);
        self.available(item.available);
        self.description(item.description);
        self.imgPath = item.imgPath;
        self.averagePrepTime = item.averagePrepTime;
        self.restaurantId = item.restaurantId;
    }
}

var MenuViewModel = function() {
    var self = this;
    self.menus = ko.observableArray();
    self.selectedItem = ko.observable(new FoodItemModel());
    self.clickItem = function(item){
        self.selectedItem(item);
        $("#show-food-item-options").modal("show");
    };
    self.addToOrder = function(item) {
        var quantity = $("#item-quantity").val();
        var instructions = $("#special-instructions-text").val();
        //Add item to order
        console.log(item.price());
        $.post("/restaurants/AddItemToOrder", {itemId: item.id(), restaurantId: restaurantId, quantity: quantity, name: item.name(), instructions: instructions, price: item.price()}, function(response){
            console.log(response.message);
            $("#show-food-item-options").modal("hide");

            //Put text into & Show thank-you banner
            $("#notify-text").text("Your item has been added!");
            $("#notify").fadeIn("slow").delay(1600).fadeOut("slow");
        });
    };

    self.fetchMenus = function() {
        $.post("/admin/fetchMenus", {restaurantId: restaurantId}, function(menus){
            menus.forEach(function (menu) {
                self.menus.push(new MenuModel(menu));
            });
            $('#all-menus').fadeIn();
        });
    };

    self.incrementQuantity = function (data, event) {
        var amount = parseInt($("#item-quantity").val());
        console.log(amount);
        console.log(event.target);
        if($(event.target).data("type") == "plus")
        {
            if(amount == 1 || amount < 10)
            {
                amount = (amount + 1);
            }
        }
        else
        {
            if(amount == 10 || amount > 1)
            {
                amount = (amount - 1)
            }
        }
        $("#item-quantity").val(amount);
    };
};
$(document).ready(function(){
    var menuModel = new MenuViewModel();
    menuModel.fetchMenus();
    ko.applyBindings(menuModel, document.getElementById('restaurant-menu'));
});
