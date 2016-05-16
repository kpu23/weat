var OrderModel = function () {
    var self = this;
    self.items = ko.observableArray();
    self.paymentInfo = ko.observable();
    self.orderTotal = ko.computed(function()  {
        var total = 0;
        self.items().forEach(function(item) {
            var price = parseFloat(item.price)
            total += price;
        });
        return total.toFixed(2);
    });
    self.restaurantId = '';

    self.fetchOrderData = function () {
        $.get("/getOrderData", function(result){
            console.log(result);
            if (result.error) {
                alert('Error occurred. Please contact us at help@weat.com.')
            } else {
                // Combine Instructions with Food Item Data
                self.restaurantId = result.restaurantId;
                var orderItems = [];
                console.log(result.orderItems);
                result.orderItems.forEach(function(item) {
                    orderItems.push(item);
                });
                self.items(orderItems);
            }
        });
    };

    self.deleteItem = function (item) {
        self.items.remove(item);
    };

    // Members
    self.submitOrder = function () {
        // construct data to send
        var ids = [];
        self.items().forEach(function(item) {
            ids.push(item.itemId);
        });
        var orderData = {
            paymentMethodId: '56c503be9bc2f4cc1396845e',
            itemIds: ids,
            restaurantId: self.restaurantId,
            total: self.orderTotal()
        };
        console.log(ko.toJSON(orderData));
        $.post('/submitOrder',{order: ko.toJSON(orderData)}, function(response) {
            console.log(response);
            if (!response.error) {
                $('#my-order').hide();
                $('#thank-you').fadeIn();
            } else {
                alert('Please login to order.');
            }
        });
    };


    self.showPaymentMethod = function(){
        $("#payment-method").show();
        $("#default-payment").attr("checked", false);
    };

    self.fetchPaymentInfo = function () {
        $.post('/fetchPaymentInfo',{}, function(response) {
            console.log(response);
            if(!response.error && response[0] && response[0].number) 
            { 
                var ccNumber = response[0].number.substr(response[0].number.length - 4); 
                console.log(ccNumber);
                self.paymentInfo(ccNumber);
            }
        });
    };
};

$(document).ready(function(){
    var orderModel = new OrderModel();
    orderModel.fetchOrderData();
    orderModel.fetchPaymentInfo();
    ko.applyBindings(orderModel, document.getElementById('my-order'));
});

