var express = require('express');
var router = express.Router();

/* We can seperate routes into different files as it makes sense. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
