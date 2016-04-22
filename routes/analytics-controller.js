/**
 * Created by Ben on 4/21/2016.
 */
var express = require('express');
var router = express.Router();
var Order = require('../models/order');

router.post('/admin/getDailyOrderData', function (req, res) {
    var restaurantId = req.session.user.restaurantId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    Order.find({submitTime: {"$gte": fromDate, "$lt": toDate}, restaurantId: restaurantId}, function(error, orders) {
        var orderCountByHours = new Array(24); //each index = an hour
        if (orders) {
            orders.forEach(function (order) {
                console.log(order.submitTime.getHours());
                var hour = order.submitTime.getHours();
                if(!orderCountByHours[hour]) {
                    orderCountByHours[hour] = 1
                } else {
                    orderCountByHours[hour] ++;
                };
                console.log(orderCountByHours);
            });
        }
        res.send(orderCountByHours);
    });
});

module.exports = router;