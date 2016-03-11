var restaurantId = "56c503be9bc2f4cc1396845e"; //HACK: fetch from logged-in account

var NewMenu = {
    name: '',
    isPublic: false,
    restaurantId: restaurantId,
    categories: []
};

var MenuModel = function() {
    var self = this;
    self.menus = ko.observableArray();
    self.newMenu = ko.observable(NewMenu);
    self.fetchMenus = function() {
        $.post("/admin/fetchMenus", {restaurantId: restaurantId}, function(menus){
            console.log("ajax...menu data:");
            console.log(menus);
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
    self.showMenu = function(menu) {
        console.log(menu._id);
    }
};
$(document).ready(function(){
    var menuModel = new MenuModel();
    menuModel.fetchMenus();
    ko.applyBindings(menuModel, document.getElementById('menu-manager'));
});