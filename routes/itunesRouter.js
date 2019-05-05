var express = require('express');
var router = express.Router();
var request = require('request');


router.get('/', function (req, res) {
    //Implementa il modulo itunes
    var artista = req.query.artista;
    var indirizzo = 'https://itunes.apple.com/search?term=' + artista;

    request.get(indirizzo, function (err, result, body) {
        var risposta = JSON.parse(body);
        var canzone = "";
        var lista = new Array();
        creaListaCanzoni(risposta, lista);
        res.render('itunes', {
            title: 'Dora Sounds',
            message: 'Canzoni di '+artista,
            array: lista
        });

    });
})

module.exports = router;

function creaListaCanzoni(risposta, lista) {
    for (i = 0; i < risposta.results.length; i++) {
        let name = risposta.results[i].artistName;
        let img = risposta.results[i].artworkUrl100;
        let songName = risposta.results[i].collectionName;
        let audio2 = risposta.results[i].previewUrl;

        var oggetto = {
            nome: name,
            immagine: img,
            titolo: songName,
            audio: audio2
        };
        lista[i] = oggetto;
    }
    return lista;
}