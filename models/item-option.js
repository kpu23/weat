/**
 * Created by Ben on 2/17/2016.
 */
var mongoose = require('mongoose');

// create item option schema
var item = {name: "", required : true};

var itemOptionSchema  = mongoose.Schema({
  "foodItems" : [item]
});

// create model if not exists
module.exports = mongoose.model('itemoptions', itemOptionSchema);

//TODO This idea is weird. We may need a new schema