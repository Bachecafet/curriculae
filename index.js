const express = require('express');
const routes= require('./routers/api');
const bodyParser = require('body-parser');
var path = require('path');
var port = process.env.port || 4000;
//set up express
const app = express();
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use('/api',routes);


//error handling
app.use(function(err,req,res,next){
    console.log('err');
    res.status(422).send({error: err.message});
});

//listen for request
app.listen(port,function(){
    console.log('Listening on port: ' + port);
});