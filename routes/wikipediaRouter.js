var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function (req, res) {
    //*Implementa modulo wikipedia

    var search = req.query.artista;
    var indirizzo = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+search+'&namespace=0&limit=10';
    request.get(indirizzo, function(err,responce,body){

        var risposta = JSON.parse(body);
        var lista = new Array;

        creaLista(risposta,lista);
        
        res.render('wikipedia',{
            title: search,
            message: search.toUpperCase(),
            array: lista,
            link: risposta[3],
        })
        //res.send(risposta[2]);

    });

    //*/
    //res.send('Man at work');
})

function creaLista(risposta,lista){

    for(i = 0; i< risposta[2].length; i++){

        lista[i] = risposta[2][i];

       
    }
    return lista;
}

module.exports = router;