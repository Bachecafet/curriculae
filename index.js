const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/conoscenze', (req,res) => res.render('pages/conoscenze'))
  .get('/progetti', (req,res) => res.render('pages/progetti'))
  .get('/contatti', (req,res) => res.render('pages/contatti'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
