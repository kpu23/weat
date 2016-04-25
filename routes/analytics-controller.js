/**
 * Created by Ben on 4/21/2016.
 */
var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var FoodItem = require("../models/food-item");

// Marketing and Analytics
router.get('/marketing_analytics', function (req, res) {

    var data = {
        numbOfOrders: 0,
        totalSales: 0,
        topSeller: ''
    };
    var itemIdHashmap = {};
    var restaurantId = req.session.user.restaurantId;
    var today = new Date();
    console.log(today);
    //get daily orders
    Order.find({}, function(error, orders) {       
        if (orders) {
            data.numbOfOrders = orders.length;
            console.log(orders);   

            for(i = 0; i < orders.length; i++){
                //add up total sales
                data.totalSales += orders[i].total;
                //bucket item counts
                for(j = 0; j < orders[i].itemIds.length; j++){
                    
                    if(itemIdHashmap[orders[i].itemIds[j]]) {
                        itemIdHashmap[orders[i].itemIds[j]] ++;
                    } else {
                        itemIdHashmap[orders[i].itemIds[j]] = 1                       
                    };
                }  
            } 
            //get top seller
            var topSellerItemId;
            var topSellerCount = 0;
            for(var key in itemIdHashmap){
                if(!topSellerItemId || itemIdHashmap[key] > topSellerCount){
                    topSellerItemId = key;
                }
            }    
            FoodItem.findOne({_id: topSellerItemId}, function (error, item){
                if(item){
                    data.topSeller = item.name;
                    console.log(item);
                }              
                res.render('marketing_analytics', {title: 'weat: Marketing & Analytics', analyticData: data});
            });          
        }
    });
    //get daily sales
    //get daily favorite item

});

router.post('/admin/getDailyOrderData', function (req, res) {
    var restaurantId = req.session.user.restaurantId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    Order.find({submitTime: {"$gte": fromDate, "$lt": toDate}, restaurantId: restaurantId}, function(error, orders) {
        var orderCountByHours = new Array(24); //each index = an hour
        if (orders) {
            orders.forEach(function (order) {
                //console.log(order.submitTime.getHours());
                var hour = order.submitTime.getHours();
                if(!orderCountByHours[hour]) {
                    orderCountByHours[hour] = 1
                } else {
                    orderCountByHours[hour] ++;
                };
                //console.log(orderCountByHours);
            });
        }
        res.send(orderCountByHours);
    });
});

module.exports = router;