/**
 * Created by Ben on 2/17/2016.
 */
var mongoose = require('mongoose');

// create menu category schema
var paymentOptionSchema  = mongoose.Schema({
  "accountId" : mongoose.Schema.Types.ObjectId,
  "nameOnCard" : String,
  "number" : String,
  "expirationDate" : String,
  "cvv" : Number,
  "address" : String,
  "city" : String,
  "state" : String,
  "zip" : String,
});

// create model if not exists
module.exports = mongoose.model('paymentoptions', paymentOptionSchema);