var express = require("express");
var admin = require("firebase-admin");

var port = process.env.PORT || 8080;

var app = express();

var registrationToken = "f0YDKgJYcBA:APA91bEVNZDtyaAWpkUmZzb9tGVZU-XqlDZrLcbSbnjlpEBk0-YKeyP7hAtc9mFygcO5n9sL0FzNWuCpEzUm4DgXx-Ie2lqfqdvMCWsvCOTRKv-PXKcgIL7Rklwm27nNULIJe9AXZUho";

var payload = {
  notification: {
    title: "Motion detected !",
    body: "Somebody is in your house !"
  }
};

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.projectId,
    clientEmail: process.env.clientEmail,
    privateKey: process.env.privateKey
  }),
  databaseURL: "https://jarvis-773da.firebaseio.com/"
});

app.post('/alert', function(req, res) {
    admin.messaging().sendToDevice(registrationToken,payload)
    .then(function(response){
      console.log("Success ! ", response);
    })
    .catch(function(error){
      console.log("Error ! ", error);
    })
});

app.get('/', function(req, res) {
    res.send("Hello World !");
});

app.listen(port, function() {
    console.log('Running on port ' + port);
});
