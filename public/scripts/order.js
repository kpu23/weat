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
            } else {
                // Combine Instructions with Food Item Data
                self.restaurantId = result.restaurantId;
                var orderItems = [];
                console.log(result.orderItems);
                var total = 0;
                result.orderItems.forEach(function(item) {
                    var price = parseFloat(item.price)
                    total += price;
                    orderItems.push(item);
                });
                total = total.toFixed(2);
                self.orderTotal(total);
                self.items(orderItems);
            }
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
            restaurantId: self.restaurantId,
            total: self.orderTotal()
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

    self.editItem = function(){

    };

    self.fetchPaymentInfo = function () {
        $.post('/fetchPaymentInfo',{}, function(response) {
            console.log(response);
            var ccNumber = response[0].number;
            if (!response.error) {
                console.log('no error');
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

