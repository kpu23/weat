/**
 * Created by Ben on 2/17/2016.
 */
var mongoose = require('mongoose');

// create food item schema
var foodItemSchema  = mongoose.Schema({
  "name" : String,
  "price" : Number,
  "available" : Boolean,
  "description" : String,
  "imgPath" : String,
  "averagePrepTime" : String, // in minutes
  //"itemOptions" : [mongoose.Schema.Types.ObjectId],
  "restaurantId" : mongoose.Schema.Types.ObjectId //,
  //"foodItems" : [mongoose.Schema.Types.ObjectId]
});

// create model if not exists
module.exports = mongoose.model('fooditems', foodItemSchema);