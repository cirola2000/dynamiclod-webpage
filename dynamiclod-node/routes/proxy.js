var express = require('express');
var request = require('request');
var router = express.Router();


router.get('/', function (req, res, next) {
  
  var query = req.query.serverURL;

  // temporary solution
  if(typeof req.query.rdfFormat != 'undefined'){
    query = query +"&rdfFormat="+req.query.rdfFormat; 
  }

  console.log(query);

  request(query, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({resp: JSON.parse(body)});
    }
    else {
      console.log(error);
      res.send({error: error});
    }
  });
});


module.exports = router;