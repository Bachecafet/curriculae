var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function (req, res) {
    var q = req.query.artista;
    var key = "AIzaSyB-FyRXsDhSikWJ06f_vXx4fZItUoM-ELU"
    var indirizzo = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=" + q + "&key=" + key;
    
    request.get(indirizzo, function (err, result, body) {
        var risposta = JSON.parse(body);
        var lista = [];
        creaListaVideo(risposta,lista);
        res.render('youtube', {
            title: 'Dora Sounds YouTube',
            message: 'Video relativi a: '+q,
            array: lista
        });
    });
})
function creaListaVideo(risposta, lista) {
    for (i = 0; i < risposta.items.length; i++) {
        let titolo = risposta.items[i].snippet.title;
        let videoid = risposta.items[i].id.videoId;
        let descrizione = risposta.items[i].snippet.description;
        let immagine = risposta.items[i].snippet.thumbnails.high.url; 

        var oggetto = {
            titolo: titolo,
            videoid: videoid,
            descrizione: descrizione,
            immagine: immagine,
        };
        lista[i] = oggetto;
    }
    return lista;
}


module.exports = router;