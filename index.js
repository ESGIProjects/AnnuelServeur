var express = require("express");
var admin = require("firebase-admin");

var port = process.env.PORT || 8080;

var app = express();

var registrationToken = "c5d-BttVGaY:APA91bH1INMy5OWaqpo0OwZi-dJOBVw3e2TuhTRH-gFm_gCYVVgcLG0aipVNjRlynpyi1McxFtVwUrfYRBfvyZ3GeR4Y-Pt4_ehmOl2Tyqure1jfmVZwzGNNr_cjnCK61h4bpdw8z4M";

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
    res.send(process.env.projectId);
    res.send(process.env.clientEmail);
    res.send(process.env.privateKey);
});

app.listen(port, function() {
    console.log('Running on port ' + port);
});
