/**
 * Created by Ben on 2/17/2016.
 */
var mongoose = require('mongoose');

var item = {itemId : mongoose.Schema.Types.ObjectId, instructions : String};

// create order schema
var orderSchema  = mongoose.Schema({
  "userId" : mongoose.Schema.Types.ObjectId,
  "user" : Object,
  "status" : String,
  "submitTime": Date,
  "paymentMethodId" : mongoose.Schema.Types.ObjectId,
  "restaurantId" : mongoose.Schema.Types.ObjectId,
  "itemIds" : [mongoose.Schema.Types.ObjectId],
  "total" : Number,
  "items" : [{ itemId : mongoose.Schema.Types.ObjectId, instructions : String }]
});

// create model if not exists
module.exports = mongoose.model('order', orderSchema);