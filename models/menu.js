/**
 * Created by Ben on 2/17/2016.
 */

var mongoose = require('mongoose');

// create menu schema
var menuSchema  = mongoose.Schema({
  "name" : String,
  "isPublic" : Boolean,
  "startTime" : Date,
  "endTime" : Date,
  "menuCategories" : [mongoose.Schema.Types.ObjectId]
});

// create model if not exists
module.exports = mongoose.model('menu', menuSchema);