var express = require('express');
var router = express.Router();
var scegliServizio = require("./scegliServizioRouter");
var chatLog= require("./chatLogRouter");
var passport = require('passport');

 
router.get('/', function (req, res) {
   res.render('homepage', {
       porta: process.env.PORT || 3000
   });
})

router.use('/scegliServizio', scegliServizio);
router.use('/chatLog', chatLog);
module.exports = router;