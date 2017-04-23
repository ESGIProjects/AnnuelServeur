var express = require("express");
var admin = require("firebase-admin");
var pg = require("pg");

var port = process.env.PORT || 8080;

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})) ;

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
      res.status(200).send("Success");
    })
    .catch(function(error){
      console.log("Error ! ", error);
    })
});

app.post('/registerToken', function(req,res) {
    var deviceToken = req.body.deviceToken;
    //var pgurl = 'postgres://ppticfpidgeahq:fdf2b36f67cd135f548fba7db4790e998b0f49b99fa19589b838ade05a7a90e5@ec2-79-125-125-97.eu-west-1.compute.amazonaws.com:5432/d4badkjb2buqr';

    console.log('Device token is : ' + deviceToken);

    /*pg.defaults.ssl = true;
    pg.connect(pgurl, function(err, client) {
    if (err) throw err;
    console.log('Connecté à la BDD');

    client.query('INSERT INTO devicetokens (token_string) VALUES($1);', [deviceToken], function(err, result) {
            if (err) throw err;
            console.log(result);
        });
    }); */
});

app.get('/displayToken', function(req, res) {
    /*var pgurl = 'postgres://ppticfpidgeahq:fdf2b36f67cd135f548fba7db4790e998b0f49b99fa19589b838ade05a7a90e5@ec2-79-125-125-97.eu-west-1.compute.amazonaws.com:5432/d4badkjb2buqr';

    pg.defaults.ssl = true;
    pg.connect(pgurl, function(err, client) {
        if (err) throw err;
        console.log('Connected to pg! Getting schemas...');

        client
            .query('SELECT table_schema, table_name FROM information_schema.tables;')
            .on('row', function(row) {
                console.log(JSON.stringify(row));
            });
    }); */
});

app.post('/updatePassword', function(req,res){

});

app.get('/', function(req, res) {
    res.send(port);
});

app.listen(port, function() {
    console.log('Running on port ' + port);
});
