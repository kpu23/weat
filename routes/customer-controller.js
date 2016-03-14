var express = require('express');
var router = express.Router();
var Order = require("../models/order");
var FoodItem = require("../models/food-item");

/* GET Order Page */
router.get('/order', function(req, res) {
    res.render("Order", {title: "weat: your order"});
});
router.get('/getOrderData', function (req, res) {
    var response = {};
    if(req.session.order != null) {
        //grab items
        FoodItem.find({_id: {$in: req.session.order.itemIds}}, function (error, items){
            if(error){
                console.log(error);
                response = {error: true, message: 'Error finding food items associated with order.'};
            }
            else {
                var response = {items: items, instructions: req.session.order.items}
                res.send(response);
            }
        });
    }
});

/* POST - Submit Order */
router.post('/submitOrder', function(req, res) {
    var data = JSON.parse(req.body.order);
    console.log(data);
    var response = {};
    // req.body.orderItems = [123,1234];
    // req.body.paymentMethodID = 123;
    // req.body.userId = 123;

    // Create Order
    if (req.session.user) {
        var order = new Order();
        order.status = "Pending";
        order.userId = req.session.user._id;
        order.paymentMethodId = data.paymentMethodId;
        order.itemIds = data.itemIds;
        order.save(function(err) {
            if (err) {
                console.log(err);
                response = {"error": true, "message": "Error submitting order."};
            } else {
                response = {"error": false, "message": "Order submitted!"};
            }
            res.json(response);
        });
    } else {
        console.log('user is not logged in');
    }


});

module.exports = router;