/**
 * Created by Ben on 2/17/2016.
 */

var mongoose = require('mongoose');

// create menu category schema
var menuCategorySchema = mongoose.Schema({
    "name": String,
    "description": String,
    "imgPath": String,
    "restaurantId": mongoose.Schema.Types.ObjectId,
    "foodItems": [mongoose.Schema.Types.ObjectId],
    "meals": [mongoose.Schema.Types.ObjectId]
});

// create model if not exists
module.exports = mongoose.model('menucategories', menuCategorySchema);