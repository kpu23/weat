/**
 * Created by Ben on 2/17/2016.
 */
var mongoose = require('mongoose');

// create food item schema
var foodItemSchema  = mongoose.Schema({
  "name" : String,
  "price" : String,
  "status" : String,
  "description" : mongoose.Schema.Types.ObjectId,
  "imagePath" : String,
  "averagePrepTime" : Number, // in minutes
  "itemOptions" : [mongoose.Schema.Types.ObjectId],
  "restaurantId" : mongoose.Schema.Types.ObjectId,
  "foodItems" : [mongoose.Schema.Types.ObjectId]
});

// create model if not exists
module.exports = mongoose.model('foodItem', foodItemSchema);