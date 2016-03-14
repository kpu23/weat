var express = require('express');
var router = express.Router();
var Order = require("../models/order");
var FoodItems = require("../models/food-item");




/* GET Order */
router.get('/order', function(req, res) {
    if(req.session.order != null)
    {
        //grab items
        console.log(req.session.order.itemIds);

        FoodItems.find({_id: {$in: req.session.order.itemIds}}, function (error, items){
            if(error){
                console.log(error);
            }
            else {
                console.log(items);    
                res.render("Order", { items: items, title: "weat: your order"});
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