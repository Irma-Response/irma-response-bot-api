const express = require('express')
const app = express()
var bodyParser = require('body-parser');

const sheltersByZip = require('./index.js');

app.use(bodyParser.json()); // for parsing application/json

app.get('/sheltersByZip', sheltersByZip.sheltersByZip);
app.post('/sheltersByZip', sheltersByZip.sheltersByZip);

app.listen(3000, function () {
  console.log('Dev Server listening on http://localhost:3000')
})
