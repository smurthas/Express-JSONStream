var jsonStream = require('./index');
var express = require('express');
var app = express.createServer(jsonStream());

app.get('/stream-yo', function(req, res) {
  res.jsonStream({small:'world'});
  res.jsonStream({after:'all'});
  res.end();
});

app.post('/stream-yo', function(req, res) {
  req.jsonStream()
  .on('object', console.log)
  .on('response', function(response) {
    if(response.statusCode !== 200) console.error('got non 200 response', response);
  })
  .on('error', console.error).on('end', function() {
    res.send('ok');
  });
});


app.listen(8553);
console.log('listening on', 8553);
