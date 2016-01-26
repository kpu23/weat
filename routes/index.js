var express = require('express');
var User = require("../models/user");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{title: 'weat: home'});
});

/* GET users listing. */
router.get('/about', function(req, res, next) {
    res.render('about',{title: 'weat: about'});
});

router.route("/signup")
    .get(function(req,res) {
        res.render('signup',{title: 'weat: signup'});
    })
    .post(function(req,res){
        var response = {};
        // Mongo command to check if user exists.
        User.find({'email': req.body.email}, function (err, data) {
            console.log(data);
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
                res.json(response);
            } else if (data.length > 0){
                response = {"error": false, "message": "Sorry, that email is already in use."};
                res.json(response);
            } else {
                // Create User
                var user = new User();
                // fetch email and password from REST request.
                // Add strict validation when you use this in Production.
                user.email = req.body.email;
                // Hash the password using SHA1 algorithm.
                user.password =  require('crypto')
                    .createHash('sha1')
                    .update(req.body.password)
                    .digest('base64');

                user.save(function(err) {
                    // save() will run insert() command of MongoDB.
                    // it will add new data in collection.
                    if (err) {
                        response = {"error": true, "message": "Error adding data"};
                    } else {
                        response = {"error": false, "message": "Data added"};
                    }
                    res.json(response);
                });
            }
        });
    });

module.exports = router;