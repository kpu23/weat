/**
 * Created by ben on 1/16/2016.
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

// create user schema
var accountSchema  = mongoose.Schema({
    "email" : String,
    "password" : String
});

// create model if not exists
module.exports = mongoose.model('account', accountSchema);