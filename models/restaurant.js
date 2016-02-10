/**
 * Created by Ben on 2/10/2016.
 */

var mongoose = require('mongoose');

// connect to the db
mongoose.connect("mongodb://localhost:27017/weat", function(err, db) {
  if(!err) {
    console.log("Connected to Mongo!");
  } else {
    console.log(err);
  }
});

// create restaurant schema
var restaurantSchema  = mongoose.Schema({
  "name" : String,
  "type" : String,
  "location" : String,
  "phone" : String,
  "siteURL" : String
});

// create model if not exists
module.exports = mongoose.model('restaurant', restaurantSchema);