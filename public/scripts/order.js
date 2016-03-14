var OrderModel = function () {
    var self = this;
    self.items = ko.observableArray();
    self.getOrderData = function () {

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
