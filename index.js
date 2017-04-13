var express = require("express");
var admin = require("firebase-admin");

var port = process.env.PORT || 8080;

var app = express();

var registrationToken = "dg8AfCG2lPM:APA91bF4nK444FDuREqjBT9PzAnGGSEPcyvIu4Vi6kBHs3JswS8wwot7PswtWnIDANa65KCv3zuhOWsjAHepBD6gom07jZXyLrFhayWtxlMdals2qDJMqaHm7L6OfXEnEQa58o1rPlBx";

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
