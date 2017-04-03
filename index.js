var express = require('express');

var port = process.env.PORT || 8080;

var app = express();

app.get('/', function(req, res) {
    res.send('Hello World')
});

app.listen(port, function() {
    console.log('Running on port ' + port);
});
