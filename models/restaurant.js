/**
 * Created by Ben on 2/10/2016.
 */

var mongoose = require('mongoose');

// create restaurant schema
var restaurantSchema  = mongoose.Schema({
  "name" : String,
  "type" : String,
  "location" : String,
  "phone" : String,
  "siteURL" : String,
  "status": Boolean,
  "foodtype": Array
});

// create model if not exists
module.exports = mongoose.model('restaurants', restaurantSchema);