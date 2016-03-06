var express = require('express');
var router = express.Router();

/* My restaurants page */
router.get('/my_restaurants', function(req, res, next) {
    res.render('my_restaurants',{title: 'weat: home'});
});

module.exports = router;