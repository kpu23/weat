var express = require('express');
var router = express.Router();

/* GET Menu */
router.get('/menu', function(req, res, next) {
    res.render('menu',{title: 'weat: menu'});
});

module.exports = router;