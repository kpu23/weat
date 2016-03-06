var restaurantId = "56c503be9bc2f4cc1396845e"; //HACK: fetch from logged-in account

var MenuModel = function() {
    var self = this;
    self.menus = ko.observableArray();
    self.fetchMenus = function() {
        $.post("/admin/fetchMenus", {restaurantId: restaurantId}, function(menus){
            console.log("ajax...menu data:");
            console.log(menus);
            self.menus(menus);
        });
    };
    self.createMenu = function() {

    };
};
$(document).ready(function(){
    var menuModel = new MenuModel();
    menuModel.fetchMenus();
    ko.applyBindings(menuModel, document.getElementById('menu-manager'));
});