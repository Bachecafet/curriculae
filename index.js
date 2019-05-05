const express = require('express');
const routes= require('./routers/api');
const bodyParser = require('body-parser');


//set up express
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api',routes);


//error handling
app.use(function(err,req,res,next){
    console.log('err');
    res.status(422).send({error: err.message});
});

//listen for request
app.listen(process.env.port || 4000,function(){
    console.log('Listening...\n');
});