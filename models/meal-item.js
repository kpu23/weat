/**
 * Created by Ben on 2/17/2016.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;;

// create meal item schema
var mealItemSchema  = Schema({
  "name" : String,
  "price" : String,
  "status" : String,
  "description" : ObjectId,
  "imagePath" : String,
  "averagePrepTime" : Number, // in minutes
  "restaurantId" : ObjectId,
  "foodItems" : [ObjectId]
});

// create model if not exists
module.exports = mongoose.model('mealitem', mealItemSchema);