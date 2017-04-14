var express = require("express");
var admin = require("firebase-admin");

var port = process.env.PORT || 8080;

var app = express();

var registrationToken = "cyddXI_muVg:APA91bHaaVq6RgytkpGLdrUC-Px73uvU-oqyRdFwoq621_K154NkaRrHKGEkY3wr6AbP4OTBYjVeR_9afvJ7h5Lhyt369-K7vk25Rpa1JfbqVyYRSUqbjeg6KBJ51IpBWsNAfVhUA7Fz";
var key = process.env.privateKey;

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
    privateKey:  key.replace(/\\n/g, '\n')
  }),
  databaseURL: "https://jarvis-773da.firebaseio.com/"
});

app.post('/alert', function(req, res) {
    admin.messaging().sendToDevice(registrationToken,payload)
    .then(function(response){
      console.log("Success ! ", response);
      process.exit(200);
    })
    .catch(function(error){
      console.log("Error ! ", error);
    })
});

app.get('/', function(req, res) {
    res.send("Test");
});

app.listen(port, function() {
    console.log('Running on port ' + port);
});
