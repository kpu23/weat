/**
 * Created by ben on 3/6/2016.
 */

function OrderModel (order) {
    var self = this;
    self.order = order;
    self.foodItems = ko.observableArray();

    self.fetchFoodItems = function(data, event) {
        console.log("here1", data.order.itemIds);
        $.post("/admin/fetchFoodItems", {foodItemIds: JSON.stringify(data.order.itemIds)}, function(items){
            
            console.log("items", items);
            var itemsWithInstructions = [];
            items.forEach(function (dbItem) {
               order.items.forEach(function(item) {
                    if(item.itemId == dbItem._id) {
                        dbItem.instructions = item.instructions;
                        console.log("item4", dbItem);
                        itemsWithInstructions.push(dbItem);
                    }
                    
                });
            });
            self.foodItems(itemsWithInstructions);          
        });
    };

    self.fetchOrderData = function () {
        $.get("/getOrderData", function(result){
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else
                // Combine Instructions with Food Item Data
                var itemsWithInstructions = [];
                result.items.forEach(function (dbItem) {
                   result.instructions.forEach(function(item) {
                        if(item.itemId == dbItem._id) {
                            console.log('here');
                            dbItem.instructions = item.instructions;
                            console.log(dbItem);
                            itemsWithInstructions.push(dbItem);
                        }
                    });
                });
                self.foodItems(itemsWithInstructions);
        });
    };
}


function LiveFeedModel(){
	var self = this;
 	self.orderList = ko.observableArray();

 	self.updateLiveFeed = function(){
 		$.get("/admin/fetchLiveOrders", 
 			function(orders){
 				console.log("orders", orders);

                var models = $.map(orders, function(order){
                    return new OrderModel(order);
                });

            	self.orderList(models);
            	//call update after 5 seconds
            	//setTimeout(self.updateLiveFeed, 5000);
        });
 	}
}

 $(document).ready(function(){
    var liveFeedModel = new LiveFeedModel();
    ko.applyBindings(liveFeedModel, document.getElementById('live-feed'));
    liveFeedModel.updateLiveFeed();
});
