var express = require('express');
var User = require("../models/user");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{title: 'weat: home'});
});

/* GET users listing. */
router.get('/login', function(req, res, next) {
    res.send('respond with a resource');
});

router.route("/users")
    .get(function(req,res) {
        var response = {};
        // Mongo command to fetch all data from collection.
        User.find({}, function (err, data) {
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = {"error": false, "message": data};
            }
            res.json(response);
        });
    })
    .post(function(req,res){
        var user = new User();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        user.email = req.body.email;
        // Hash the password using SHA1 algorithm.
        user.password =  require('crypto')
            .createHash('sha1')
            .update(req.body.password)
            .digest('base64');

        user.save(function(err){
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });

module.exports = router;