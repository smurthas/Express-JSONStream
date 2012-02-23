Simple middleware for JSON streaming in Express. Stringifys and sends object delimited by ```\n```'s with the ```Content-Type : application/jsonstream``` header

    var jsonStream = require('express-jsonstream');
    var express = require('express');
    var app = express.createServer(jsonStream());

    app.get('/stream-yo', function(req, res) {
      res.jsonStream({small:'world'});
      res.jsonStream({after:'all'});
      res.end();
    });

    app.listen(8553);
    console.log('listening on', 8553);

You can run the example with:

    node example

a GET to /stream-yo:

    curl "http://localhost:8553/stream-yo" -G -v
    * About to connect() to localhost port 8553 (#0)
    *   Trying 127.0.0.1... connected
    * Connected to localhost (127.0.0.1) port 8553 (#0)
    > GET / HTTP/1.1
    > User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
    > Host: localhost:8553
    > Accept: */*
    >
    < HTTP/1.1 200 OK
    < X-Powered-By: Express
    < content-type: application/jsonstream
    < Connection: keep-alive
    < Transfer-Encoding: chunked
    <
    {"small":"world"}
    {"after":"all"}
    * Connection #0 to host localhost left intact
    * Closing connection #0