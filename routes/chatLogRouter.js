var express = require('express');
var router = express.Router();
var request = require('request');
var amqp = require('amqplib/callback_api');
var url= process.env.CLOUDAMQP_URL || "amqp://localhost";
//Questi sono tutti i servizi offerti e inclusi nel router
var msgList=[];

router.get('/', function (req, res) {
    amqp.connect(url, function (err, conn) {
        conn.createChannel(function (err, ch) {
            var q = 'log';
            ch.assertQueue(q, {
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.consume(q, function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
                msgList.push( msg.content.toString());                
                console.log(JSON.stringify(msgList));
            }, {
                noAck: true
            });
            console.log('coda terminata');
            //renderizza chatLog
            setTimeout(function(){ res.render('chatLog', {msgList:msgList}); }, 3000);
        });
    });
})

//esporto il router
module.exports = router;