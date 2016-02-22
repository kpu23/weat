/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');




router.route("/restaurants/:restaurant").get(function(req,res) {
    var rName = req.params.restaurant;
    var Title = 'weat: ' + rName;
    console.log(rName);

    //grab restaurant
    Restaurant.findOne({name: rName}, function (error, result){
      if(error)
      {
        //console.log(error);
      }
      else
      {
        console.log("here: ");
         console.log(result);
         //console.log(result[0]);
        res.render("restaurant-menu", {title: Title, restaurant: result});
       
      }
    });

    //grab menu


    
   
  });

module.exports = router;
