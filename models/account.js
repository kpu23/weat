/**
 * Created by ben on 1/16/2016.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;;

// create user schema
var accountSchema  = Schema({
    "firstName": String,
    "lastName" : String,
    "userType" : String,
    "ethnicity" : String,
    "phone" : String,
    "dob" : Date,
    "gender" : String,
    "restaurantId" : ObjectId,
    "paymentDetailId" : ObjectId,
    "email" : String,
    "password" : String,
    "favorites" : Array
});

// create model if not exists
module.exports = mongoose.model('account', accountSchema);