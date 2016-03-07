var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('session', req.session);
    res.render('index',{title: 'weat: home'});
});

module.exports = router;