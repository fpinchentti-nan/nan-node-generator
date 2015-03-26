/**
* <%= applicationName %> routing configuration
*
* @module routes
*/
var router = require('express').Router();

router.get( '/', function (req, res) {
    console.log('received get request at /');
    res.send('hello world');
});

module.exports = router;
