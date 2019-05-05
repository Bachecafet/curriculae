var express = require('express');
var router = express.Router();
var request = require('request');
var amqp = require('amqplib/callback_api');
//Questi sono tutti i servizi offerti e inclusi nel router
var itunes = require('./itunesRouter');
var youtube = require('./youtubeRouter');
var wikipedia = require('./wikipediaRouter');
var spotify = require('./spotifyRouter');

var artista;
router.get('/', function (req, res) {
    artista = req.query.artista;
    res.render('scegliServizio', {
        artista: artista
    });
})

//mappo le routes sui singoli servizi dichiarati sopra
router.use("/itunes", itunes);
router.use("/youtube", youtube);
router.use("/wikipedia", wikipedia);
router.use("/spotify", spotify);

//esporto il router
module.exports = router;