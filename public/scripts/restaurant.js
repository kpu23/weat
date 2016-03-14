/**
 * Created by Ben on 2/24/2016.
 */
'use strict';

// Order Model
/*var OrderModel = function () {
  var self = this;
  // Members
  self.addOrderItem = function () {
    localStorage.setItem('orderItemIds', ['56cb96b87c9a80727f72d72e', '56cb96b87c9a80727f72d72e']);
    localStorage.setItem('userId', '56cb96b87c9a80727f72d72e');
    localStorage.setItem('paymentMethodId', '56cb96b87c9a80727f72d72e');
  };
  self.submitOrder = function () {
    // construct data to send
    var orderData = {
      'userId': localStorage.userId,
      'paymentMethodId': localStorage.paymentMethodId,
      'orderItemIds': localStorage.orderItemIds
    };
    $.ajax({
      url: '/submitOrder',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(orderData),
      success: function (response) {
        console.log('Success!');
        console.log(response);
      },
      error: function (response) {
        console.log(response);
      }
    });
  };
};*/

var itemsModel = function(){
  var self = this;
  self.items = ko.observableArray();
  self.item = ko.observable();

  self.clickCategory = function(categoryId){
    
    if($("#"+categoryId).children(".food-items").hasClass("open"))
    {
      $("#"+categoryId).children(".food-items").toggleClass("open");
      $("#"+categoryId).children(".food-items").hide(); 
    }
    else
    {
      $("#"+categoryId).children(".food-items").toggleClass("open");
      $("#"+categoryId).children(".food-items").show(); 
      
      if(!$("#"+categoryId).children(".food-items").hasClass("data-retrieved"))
      {
        console.log(categoryId);
        $.post("/restaurants/fetchItemsIdArray", {categoryId: categoryId}, function(foodItemsIdArray){
          if(foodItemsIdArray)
          {
            console.log(foodItemsIdArray);
            $.post("/restaurants/fetchFoodItems", {foodItemsIdArray: JSON.stringify(foodItemsIdArray)}, function(foodItems){
              console.log(foodItems);
              self.items(foodItems);

              //Set flag so we don't make AJAX call multiple times
              $("#"+categoryId).children(".food-items").addClass("data-retrieved");
            });
          }
        });
      }
    }
  }

  self.clickItem = function(item){
    console.log(item);
    $("#modal-item-name").text(item.name);
    $("#modal-item-name").data("item-guid", item._id);
    $("#modal-item-name").data("restaurant-guid", item.restaurantId);
    console.log($("#modal-item-name").data("item-guid"));


    //var itemModel = new itemsModel();
    //itemModel.item = item;
    //ko.applyBindings(itemModel, document.getElementById("show-food-item-options"));
    //console.log(item.foodOptions);
    /*$.post("/restaurants/fetchFoodItemOptions", {foodItemsIdArray: JSON.stringify(foodItemsIdArray)}, function(foodItems){
          console.log(foodItems);
          self.items(foodItems);
        });*/
    $("#item-quantity").val(1);
    $("#special-instructions-text").val("");
    $("#show-food-item-options").modal("show");
  }
}

$(document).ready(function () {
  //console.log('test');
  //var orderModel = new OrderModel();
  //orderModel.addOrderItem();
  //orderModel.submitOrder();

  $('.menu-category').each (function () {    
    var itemModel = new itemsModel();
    ko.applyBindings(itemModel, this);
  });

  $('.btn-number').click(function(){
    var amount = parseInt($("#item-quantity").val());

      if($(this).data("type") == "plus")
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
  });

  $("#add-item").click(function(){
    var itemId = $("#modal-item-name").data("item-guid");
    var restaurantId = $("#modal-item-name").data("restaurant-guid");
    var quantity = $("#item-quantity").val();
    var instructions = $("#special-instructions-text").val();

    //Add item to order
    addItemToOrder(itemId, restaurantId, quantity, instructions);
  });

  /*$('.menu-item').click(function(){
    console.log("here...");
    //console.log($(this).attr(id));
  });*/

});

function addItemToOrder(itemId, restaurantId, quantity, instructions)
{

  $.post("/restaurants/AddItemToOrder", {itemId: itemId, restaurantId: restaurantId, quantity: quantity, instructions: instructions}, function(response){
      console.log(response.message);
      $("#show-food-item-options").modal("hide");
  });
}
