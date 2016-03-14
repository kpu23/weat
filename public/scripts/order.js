var OrderModel = function () {
    var self = this;
    self.items = ko.observableArray();
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
                self.items(itemsWithInstructions);
        });
    };
    // Members
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
};

$(document).ready(function(){
    var orderModel = new OrderModel();
    orderModel.fetchOrderData();
    ko.applyBindings(orderModel, document.getElementById('my-order'));
});

