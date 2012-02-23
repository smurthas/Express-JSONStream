/*
 * JSON streaming for Express
 * Copyright(c) 2012 Simon Murtha-Smith
 * MIT Licensed
 */

/*
 * JSON streaming add a jsonStream function to the response object that automatically
 * sets the Content-Type: application/jsonstream header and writes \n delimited JSON objects
 */

module.exports = function jsonStream(bytes){
  return function jsonStream(req, res, next) {
    var first = true;
    res.jsonStream = function(object) {
      if (!(object && object instanceof Object)) return;
      if (first) {
        first = false;
        res.writeHead(200, {'content-type' : 'application/jsonstream'});
      }
      res.write(JSON.stringify(object) + '\n');
    }
    next();
  };
};