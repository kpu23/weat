/**
 * Created by ben on 3/6/2016.
 */

function OrderModel (order) {
    var self = this;
    self.order = order;
    self.foodItems = ko.observableArray();

    self.fetchFoodItems = function(data, event) {
        console.log("fetch food items", data);
        $.post("/admin/fetchFoodItems", {foodItemIds: JSON.stringify(data.order.itemIds)}, function(items){
            
            //console.log("items", items);
            var itemsWithInstructions = [];
            items.forEach(function (dbItem) {
               order.items.forEach(function(item) {
                    if(item.itemId == dbItem._id) {
                        dbItem.instructions = item.instructions;
                        //console.log("item4", dbItem);
                        itemsWithInstructions.push(dbItem);
                    }
                    
                });
            });
            self.foodItems(itemsWithInstructions);          
        });
    };

    // self.fetchOrderData = function () {
    //     $.get("/getOrderData", function(result){
    //         console.log(result);
    //         if (result.error) {
    //             alert('Error occurred. Please contact us at help@weat.com.')
    //         } else
    //             // Combine Instructions with Food Item Data
    //             var itemsWithInstructions = [];
    //             result.items.forEach(function (dbItem) {
    //                result.instructions.forEach(function(item) {
    //                     if(item.itemId == dbItem._id) {
    //                         console.log('here');
    //                         dbItem.instructions = item.instructions;
    //                         console.log(dbItem);
    //                         itemsWithInstructions.push(dbItem);
    //                     }
    //                 });
    //             });
    //             self.foodItems(itemsWithInstructions);
    //     });
    // };
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

    self.updateOrderStatus = function(newStatus, data, event){
        console.log('update order status', newStatus, data, event);
        $.post('/admin/updateOrderStatus', {
                orderId: data.order._id,
                status: newStatus               
            }, function(res) {
                console.log('res', res);
                if(res == 'success'){
                    //remove from list
                }else{
                    console.log('could not update', orderId);
                }
            }
        );
    }
}

 $(document).ready(function(){
    var liveFeedModel = new LiveFeedModel();
    ko.applyBindings(liveFeedModel, document.getElementById('live-feed'));
    liveFeedModel.updateLiveFeed();
});
