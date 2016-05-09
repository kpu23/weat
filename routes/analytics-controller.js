/**
 * Created by Ben on 4/21/2016.
 */
var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var FoodItem = require("../models/food-item");

// Custom Reports
router.get('/custom_reports', function (req, res) {
    var model = {
        totalOrders: 0,
        totalSales: 0,
        topSellingItem: '',
        dayOfMostOrders: '',
        dayOfHighestSales: '',
        timeOfMostOrders: ''
    };

    var restaurantId = req.session.user.restaurantId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    Order.find({}, function(error, orders) {
        //var orderCountByHours = new Array(24); //each index = an hour
        var foodItemHash = {};
        var dayOfMostOrdersHash = {};
        var dayOfHighestSalesHash = {};
        var timeOfMostOrdersHash = {};
        if (orders) {
            for(i = 0; i < orders.length; i++) {
                //get total orders
                model.totalOrders++;
                //get total sales
                model.totalSales += orders[i].total;
                //get top selling item
                for(j = 0; j < orders[i].itemIds.length; j++){
                    
                    if(foodItemHash[orders[i].itemIds[j]]) {
                        foodItemHash[orders[i].itemIds[j]] ++;
                    } else {
                        foodItemHash[orders[i].itemIds[j]] = 1                       
                    };
                }  
                //day of most orders
                if(dayOfMostOrdersHash[orders[i].submitTime]) {
                        dayOfMostOrdersHash[orders[i].submitTime] ++;
                    } else {
                        dayOfMostOrdersHash[orders[i].submitTime] = 1                       
                    };
                //day of highest sales
                if(dayOfHighestSalesHash[orders[i].submitTime]) {
                        dayOfHighestSalesHash[orders[i].submitTime] += orders[i].total;  
                    } else {
                        dayOfHighestSalesHash[orders[i].submitTime] = orders[i].total;                       
                    };
                //time of most orders
                var hour = order.submitTime.getHours();
                if(timeOfMostOrdersHash[hour]) {
                        timeOfMostOrdersHash[hour] ++;
                    } else {
                        timeOfMostOrdersHash[hour] = 1                       
                    };
                
                // if(!orderCountByHours[hour]) {
                //     orderCountByHours[hour] = 1
                // } else {
                //     orderCountByHours[hour] ++;
                // };
                //console.log(orderCountByHours);
            }

            //get top seller
            var topSellerItemId;
            for(var key in itemIdHashmap){
                if(!topSellerItemId || foodItemHash[key] > foodItemHash[topSellerItemId]){
                    topSellerItemId = key;
                }
            }
            var dayOfMostOrders;
            for(var key in dayOfMostOrdersHash){
                if(!dayOfMostOrders || dayOfMostOrdersHash[key] > dayOfMostOrdersHash[dayOfMostOrders]){
                    dayOfMostOrders = key;
                }
            }
            var dayOfHighestSales;
            for(var key in dayOfHighestSalesHash){
                if(!dayOfHighestSales || dayOfHighestSalesHash[key] > dayOfHighestSalesHash[dayOfHighestSales]){
                    dayOfHighestSales = key;
                }
            }
            var timeOfMostOrders;
            for(var key in timeOfMostOrdersHash){
                if(!timeOfMostOrders || timeOfMostOrdersHash[key] > timeOfMostOrdersHash[timeOfMostOrders]){
                    timeOfMostOrders = key;
                }
            }
            //set result to model
            model.dayOfMostOrders = dayOfMostOrders;
            model.dayOfHighestSales = dayOfHighestSales;
            model.timeOfMostOrders = timeOfMostOrders;

            FoodItem.findOne({_id: topSellerItemId}, function (error, item){
                if(item){
                    model.topSellingItem = item.name;
                    console.log(item);
                }              
                res.render('custom_reports', {title: 'weat: Custom Reports', modelData: model});
            });
        }
        //res.render('custom_reports', {title: 'weat: Custom Reports'});
    });
});

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
            //var topSellerCount = 0;
            for(var key in itemIdHashmap){
                if(!topSellerItemId || itemIdHashmap[key] > itemIdHashmap[topSellerItemId]){
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

router.get('/admin/getCustomerHistory', function (req, res) {
    var restaurantId = req.session.user.restaurantId;
    Order.find({}, function(error, orders) {
        var customers = [];
        if (orders) {
            orders.forEach(function (order) {
                console.log(customers[0], order.user);
                addToArrayIfNotExists(customers, order.user);
            });
        }
        res.send(customers);
    });
});

function addToArrayIfNotExists(array, item) {
    var exists = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i]._id == item._id) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        array.push(item);
    }
};

module.exports = router;