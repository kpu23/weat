var express = require('express');
var router = express.Router();
var Order = require("../models/order");
var FoodItem = require("../models/food-item");

/* GET Order */
router.get('/order', function(req, res) {
    res.render("Order", {title: "weat: your order"});
});
router.get('/getOrderData', function () {
    var response = {}
    if(req.session.order != null) {
        //grab items
        FoodItem.find({_id: {$in: req.session.order.itemIds}}, function (error, items){
            if(error){
                console.log(error);
                response = {error: true, message: 'Error finding food items associated with order.'};
            }
            else {
                console.log(items);
                res.send(items);
            }
        });
    }
});

/* POST - Submit Order */
router.post('/submitOrder', function(req, res) {
    console.log(req.body);
    var response = {};
    // req.body.orderItems = [123,1234];
    // req.body.paymentMethodID = 123;
    // req.body.userId = 123;

    // Create Order
    var order = new Order();
    order.status = "Pending";
    order.userId = req.body.userId;
    order.paymentMethodId = req.body.paymentMethodId;
    order.items = req.body.orderItemIds.split(',');
    order.save(function(err) {
        if (err) {
            console.log(err);
           response = {"error": true, "message": "Error submitting order."};
        } else {
           response = {"error": false, "message": "Order submitted!"};
        }
        res.json(response);
    });

});

module.exports = router;