$(document).ready(function(){
	menus = {};

	restaurantId = "56c503be9bc2f4cc1396845e"; //HACK: fetch from logged-in account

	fetchMenus();


	$("#create-menu").click(function(){
		//console.log($(this));
		if($("#create-menu-section").hasClass("hidden"))
		{
			$("#create-menu-section").removeClass("hidden");	
		}
		else
		{
			$("#create-menu-section").addClass("hidden");
		}
	})
});

function fetchMenus()
{
	$.post("/admin/fetchMenus", {restaurantId: restaurantId}, function(menus){
		console.log("ajax...menu data:");
		console.log(menus);
		createMenuHTML(menus);
		//populateMenuHTML(menus);
		$.each(menus, function(index, menu){
			console.log(menu.menuCategories);
			fetchCategories(menu.menuCategories);
		});
	});
}

function createMenuHTML(menus)
{
	/*ko.applyBindings({
		menu: [
			{
				name: "Default"	
			}
		]
	});*/
//$.each(menus, function(index, menu1){name: menu1.name});
	var html = "";

	$.each(menus, function(index, menu){

		html += "<div data-restaurant-id='" + menu._id + "'>";
		html += "<span class='menu-name'>" + menu.name + "</span>";
			$.each(menu.menuCategories, function(index2, categoryId){
				html += "<div data-categories-id='" + categoryId + "'></div>";
			});
		html += "</div>";
	});

	$("#menu-replace").html(html);
}

/*function populateMenuHTML(menus)
{
	$.each(menus, function(index, menu){
		$("div[data-restaurant-id='" + menu._id + "'").text(menu.name);
	});
}*/

function fetchCategories(menuCategories)
{
	console.log(menuCategories);
	$.post("/admin/fetchCategories", {categoryIds: JSON.stringify(menuCategories)}, function(cats){
		createCategoryHTML(cats);
		$.each(cats, function(index, cat){
			fetchFoodItems(cat.foodItems);
		});
	});
}

function createCategoryHTML(cats)
{
	var html = "";
	$.each(cats, function(index, cat){
		html = "<span class='category-name'>" + cat.name + "</span>"; //Add Category Name
		$.each(cat.foodItems, function(index2, foodItemId){
			html += "<div class='food-item' data-foodItems-id='" + foodItemId + "'></div>"
		});
		

		$("div[data-categories-id='" + cat._id + "'").append(html);
	});
}

function fetchFoodItems(foodItemIdsArray)
{
	console.log("here");
	$.post("/admin/fetchFoodItems", {foodItemIds: JSON.stringify(foodItemIdsArray)}, function(foodItems){
		console.log(foodItems);
	});
}