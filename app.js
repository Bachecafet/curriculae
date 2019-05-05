var express = require('express');
var app = express();
var router = require("./routes/router.js");
var port = process.env.PORT || 3000;
var path = require('path');
var request = require('request');
var session = require('express-session');
//webSocket
var socket = require('socket.io');
//amqp
var amqp = require('amqplib/callback_api');
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
//var rabbitMQ = amqp.createConnection({ host: 'amqp://pmdlmzkr:HYF1wI9PVlp8q0RdJQkBxtN3NU_HG6dj@spider.rmq.cloudamqp.com/pmdlmzkr', login:"pmdlmzkr", password:"HYF1wI9PVlp8q0RdJQkBxtN3NU_HG6dj" });

app.use(session({
    secret: 'session',
    resave: false,
    saveUninitialized: true
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); //Setta il view engine

app.use(express.static(path.join(__dirname, 'public')));
app.use('scripts', express.static(path.join(__dirname, 'public/scripts')));
app.use('styles', express.static(path.join(__dirname, 'public/styles')));
app.use('stiliCarte', express.static(path.join(__dirname, 'public/styles/carteSpotify')));

//socket setup
var server = app.listen(port, function() {
    console.log('In ascolto sulla porta ' + port);
});

app.use(router);

var io = socket(server);

amqp.connect(url, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'log';
    ch.assertQueue(q, {durable: false});
        io.on('connection', function(socket) {
            console.log('socket connessa', socket.id);
            // Handle chat event
            socket.on('chat', function(data) {
                io.sockets.emit('chat', data);
                var msg = data.message;
                console.log(msg);
                ch.sendToQueue(q, new Buffer(msg));
                console.log(" [x] Sent %s", msg);
            });

            socket.on('typing', function(data) {
                socket.broadcast.emit('typing', data)
            });
        });
    });
});

module.exports = app;
module.exports = port;