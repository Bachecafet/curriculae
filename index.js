const express = require('express');

//set up express
const app = express();

app.get('/api', function(req,res){

    console.log('GET request');
    res.send({name: 'Yoshi'});

});

//listen for request
app.listen(process.env.port || 4000,function(){
    console.log('Listening...\n');
});