var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('session', req.session);
    if (req.session.user != null) {
        if (req.session.user.userType == 'customer') {
            res.render('index',{title: 'weat: home'});
        } else if (req.session.user.userType == 'business'){
            res.render('admin_home',{title: 'weat: home'});
        }
    } else {
        // Unauthenticated/Guest User
        res.render('index',{title: 'weat: home'});
    }

});

module.exports = router;