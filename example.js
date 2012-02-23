var jsonStream = require('./index');
var express = require('express');
var app = express.createServer(jsonStream());

app.get('/stream-yo', function(req, res) {
  res.jsonStream({small:'world'});
  res.jsonStream({after:'all'});
  res.end();
});

app.listen(8553);
console.log('listening on', 8553);