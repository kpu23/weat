var OrderModel = function () {
    var self = this;
    self.items = ko.observableArray();
    self.paymentInfo = ko.observable();
    self.orderTotal = ko.observable(0);
    self.restaurantId = '';
    self.fetchOrderData = function () {
        $.get("/getOrderData", function(result){
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else
                // Combine Instructions with Food Item Data
                self.restaurantId = result.restaurantId;
                var itemsWithInstructions = [];
                result.items.forEach(function (dbItem) {
                   result.instructions.forEach(function(item) {
                        if(item.itemId == dbItem._id) {
                            dbItem.instructions = item.instructions;
                            itemsWithInstructions.push(dbItem);
                        }
                    });
                    console.log(dbItem);
                    self.orderTotal(self.orderTotal()+ dbItem.price) ;
                });
                self.items(itemsWithInstructions);
        });
    };
    // Members
    self.submitOrder = function () {
        // construct data to send
        var ids = [];
        self.items().forEach(function(item) {
            ids.push(item._id);
        });
        var orderData = {
            'paymentMethodId': '56c503be9bc2f4cc1396845e',
            'itemIds': ids,
            restaurantId: self.restaurantId
        };
        console.log(ko.toJSON(orderData));
        $.post('/submitOrder',{order: ko.toJSON(orderData)}, function(response) {
            console.log(response);
            if (!response.error) {
                $('#my-order').hide();
                $('#thank-you').fadeIn();
            }
        });
    };
    self.fetchPaymentInfo = function () {
        //TODO
    };
};

$(document).ready(function(){
    var orderModel = new OrderModel();
    orderModel.fetchOrderData();
    orderModel.fetchPaymentInfo();
    ko.applyBindings(orderModel, document.getElementById('my-order'));
});

