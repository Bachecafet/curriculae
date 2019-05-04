const express = require('express');
const routes= require('./routers/api');


//set up express
const app = express();

app.use('/api',routes);


//listen for request
app.listen(process.env.port || 4000,function(){
    console.log('Listening...\n');
});