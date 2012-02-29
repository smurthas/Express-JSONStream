/*
 * JSON streaming for Express
 * Copyright(c) 2012 Simon Murtha-Smith
 * MIT Licensed
 */

/*
 * JSON streaming add a jsonStream function to the response object that automatically
 * sets the Content-Type: application/jsonstream header and writes \n delimited JSON objects
 */

function RemnantError(remnant) {
  this.name = "RemnantError"
  this.message = "There was data remaining on a JSON stream."
  this.remnant = remnant;
}
RemnantError.prototype = new Error();
RemnantError.prototype.constructor = RemnantError;

module.exports = function jsonStream(bytes){
  return function jsonStream(req, res, next) {
    var incomingData = ""
    req.jsonStream = function(cbEach, cbDone) {
      if (req.method != "POST" && req.method != "PUT") {
        return cbDone(new Error("Can not stream in unless the request method is POST or PUT got " + req.method));
      }
      if (req.headers["content-type"] != "application/jsonstream") {
        return cbDone(new Error("Only a content-type of application/jsonstream may be streamed in got " + req.headers["content-type"]));
      }
      req.on("data", function(data) {
        incomingData += data.toString("utf8");
        var chunks = incomingData.split("\n");
        // The last one will always have the last bit or empty
        incomingData = chunks[chunks.length - 1];
        // Iterate over all but the last one, handled above
        for (var i = 0; i < chunks.length - 1; ++i) {
          var obj;
          try {
            obj = JSON.parse(chunks[i]);
          } catch (E) {
            // TODO:  What are we doing here?
          }
          cbEach(obj);
        }
      });
      req.on("end", function() {
         if (incomingData) {
           return cbDone(new RemnantError(incomingData));
         }
         cbDone();
      });
    }
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
