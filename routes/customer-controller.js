var express = require('express');
var router = express.Router();
var Order = require("../models/order");
var Restaurant = require("../models/restaurant");
var FoodItem = require("../models/food-item");
var PaymentOption = require("../models/payment-option");

/* GET Order Page */
router.get('/order', function(req, res) {
    res.render("Order.ejs", {title: "weat: your order"});
});
router.get('/getOrderData', function (req, res) {
    var response = {};
    console.log('getorderdata', req.session.order);
    if(req.session.order != null) {
        //grab items
        FoodItem.find({_id: {$in: req.session.order.itemIds}}, function (error, items){
            if(error){
                console.log(error);
                response = {error: true, message: 'Error finding food items associated with order.'};
                res.send(response);
            }
            else {
                console.log(items);
                response = {orderItems: req.session.order.items, restaurantId: req.session.order.restaurantId};
                res.send(response);
            }
        });
    }
});

/* POST - Submit Order */
router.post('/submitOrder', function(req, res) {
    var data = JSON.parse(req.body.order);
    console.log('orderdata', data);
    var response = {};
    // req.body.orderItems = [123,1234];
    // req.body.paymentMethodID = 123;
    // req.body.userId = 123;

    // Create Order
    if (req.session.user) {
        var order = new Order();
        order.status = "Pending";
        order.user = req.session.user;
        order.userId = req.session.user._id;
        order.submitTime = Date.now();
        order.paymentMethodId = data.paymentMethodId;
        order.restaurantId = data.restaurantId;
        order.total = data.total;
        order.items = req.session.order.items; //instructions
        order.itemIds = data.itemIds;
        order.save(function(err) {
            if (err) {
                console.log(err);
                response = {"error": true, "message": "Error submitting order."};
            } else {
                response = {"error": false, "message": "Order submitted!"};
                req.session.order = null;
            }
            res.json(response);
        });
    } else {
        console.log('user is not logged in');
        res.json({"error": true, "message": "user is not logged in."});
    }
});

router.get('/OrderHistory', function (req, res) {
    console.log('fetch orders for customers', req.session);
    if (req.session) {
        var userId = req.session.user._id;
        if (userId) {
            Order.find({'user._id': userId}, function (error, orders) {
                if (error) {
                    console.log(error);
                    res.send(null);
                } else {
                    console.log("history orders", orders);
                    getRestaurantInformation(res, orders, 0);                
                }
            });
        } else {
            res.send(null);
        }
    }
});

router.post('/fetchPaymentInfo', function (req, res) {

    console.log('fetch payment info for customer');

    if (req.session) {
        var userId = req.session.user._id;
        console.log("user id", userId);
        if (userId) {
            PaymentOption.find({acountId: userId}, function (error, payment) {
                if (error) {
                    console.log(error);
                    res.send(null);
                } else {
                    console.log("payment option", payment); 
                    res.send(payment);             
                }
            });
        } else {
            res.send(null);
        }
    }
    
});

function getRestaurantInformation(res, orders, index){   
    var order = orders[index];
    if(order){
        Restaurant.findOne({_id: order.restaurantId}, function(error, restaurant){
            console.log('resta', error, restaurant);
            if(error){
                console.log(error);
            }else{
                //rework this 
                order.restaurantName = restaurant.displayName;
                order.restaurantPhone = restaurant.phone;
                order.restaurantImage = restaurant.imgPath;
                console.log('resta', order);
                res.send(order);
                orders[index] = order;
            }
            index++;
            if(index < orders.length){
                getRestaurantInformation(res, orders, index);
            }else{
                res.send(orders);
            }
        });
    }

}

module.exports = router;