var express = require('express');
var router = express.Router();
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;
var cid= '06babb8a797e43a9a197beab540ec4e3';
var request= require('request');
var querystring = require('querystring');

var clientId= '06babb8a797e43a9a197beab540ec4e3';
var clientSecret= '381e5e0d83b444d1a1ec694f69db2856';
var callbackURL= "https://dorasounds.herokuapp.com/scegliServizio/spotify/callback/";


router.get('/', function (req, res) {
    req.session.artista= req.query.artista;
    res.redirect('https://dorasounds.herokuapp.com/scegliServizio/spotify/login');
})

router.get('/login', function(req, res) {
    
    //Indica i permessi che chiede la richiesta
    var scope = 'user-read-private user-read-email';
    //reindirizzo all'autorizzazione spotify che mi rimanderà sulla callback con il cosice per richiedere il token
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: callbackURL,
        //state: state
      }));
})

router.get('/callback', function(req, res) {
    //questo è il codice che devo utilizzare per richiedere il token
    var code= req.query.code;

    //Opzioni della request per richiedere il token
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: callbackURL,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
        },
        json: true
    };
    
    //Richiedo il token a spotify, me lo salvo e lo rimando alla nostra route spotify/logged, lì potrò lavorare con le api
    request.post(authOptions, function(error, response, body) {
        var accessToken= body.access_token,
            refreshToken= body.refresh_token;
        res.redirect('https://dorasounds.herokuapp.com/scegliServizio/spotify/logged?token='+accessToken);
    })
})


//FINALMENTE POSSO LAVORARE CON LE API PERCHE' ABBIAMO TOKEN E ARTISTA
router.get('/logged', function(req, res) {
    var artista = req.session.artista;
    var token = req.query.token;   

    /*Per richiedere i nostri dati dobbiamo fare 3 richieste alle api:
    una per l'artista, una per i suoi album e una per le sue top tracks, 
    le facciamo annidate cosicchè sono sincrone e possono accedere ai
    dati delle precedenti*/

    //richiesta artista
    var options = {  
        url: 'https://api.spotify.com/v1/search?q='+ artista + '&type=artist&market=IT&limit=1',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'my-reddit-client',
            'Authorization': 'Bearer '+token
        }
    };

    request.get(options, function(error, response, body){
        var artistData= JSON.parse(body);
        if (artistData == undefined) {
            res.redirect('https://dorasounds.herokuapp.com');
        }
        var artistId= artistData.artists.items[0].id;
        var art= artistData.artists.items[0];
        
        var artistObject= {
            nome: art.name,
            immagine: art.images[0].url
        }

        //richiesta degli album 
        var options= {
            url: ' 	https://api.spotify.com/v1/artists/'+artistId+'/albums',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+token
            }
        }

        request.get(options, function(error, response, body){
            var albumsData= JSON.parse(body);
            var arrayAlbums= albumsData.items;
            //Creo la lista degli album formattata solo con i dati necessari (nome, immagine, link a spotify)
            var listaAlbum= creaListaAlbum(arrayAlbums);

            //richiesta top-tracks
            var options= {
                url: ' 	https://api.spotify.com/v1/artists/'+artistId+'/top-tracks?country=IT',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+token
                }
            }

            request.get(options, function(error, response, body){
                var tracksData= JSON.parse(body);
                var arrayTracks= tracksData.tracks;
                //Creo la lista delle canzoni solo con i dati necessari
                var listaTracks= creaListaTracks(arrayTracks);

                //Ora che ho tutti i dati renderizzo il file pug passandogli dati formattati nei passaggi precedenti
                res.render('spotify', {
                    title: artista+' su Spotify',
                    artista: artistObject,
                    albums: listaAlbum,
                    tracks: listaTracks
                })                
            })
        })
    });
})

//Funzione che crea una lista di album con nome, foto, link
function creaListaAlbum(albums) {
    var listaAlbum=[];
    for (i=0; i<albums.length; i++) {
        var temp = albums[i];
        listaAlbum[i] = {
            nome: temp.name,
            immagine: temp.images[0].url,
            link: temp.uri,
            relase: temp.release_date
        }
    }
    return listaAlbum;
}

function creaListaTracks(tracks) {
    var listaTracks= [];
    for(i=0; i<tracks.length; i++) {
        var temp= tracks[i];
        listaTracks[i]= {
            nome: temp.name,
            link: temp.external_urls.spotify,
            album: temp.album.name,
            immagine: temp.album.images[1],
            preview: temp.preview_url
        }
    }
    return listaTracks;
}

module.exports = router;