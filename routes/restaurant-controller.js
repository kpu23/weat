/**
 * Created by Ben on 2/8/2016.
 */
var express = require('express');
var router = express.Router();

router.route("/restaurants")
  .get(function(req,res) {
    res.render('restaurant/AllRestaurants',{title: 'weat: all restaurants'});
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
        // Create Account
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

router.route("/signin")
  .get(function(req, res) {
    res.render('account/signin',{title: 'weat: sign-in'});
  })
module.exports = router;
