// Dépendances
var express = require("express");
var admin = require("firebase-admin");

// Nécessaire pour laisser Heroku contrôler le port
var port = process.env.PORT || 8080;
var app = express();

// Middleware pour parser les requêtes POST
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})) ;

// Clé Firebase
var key = process.env.privateKey;

// Notification payload
var payload = {
    notification: {
        title: "Motion detected !",
        body: "Somebody is in your house !"
    }
};

// Mise en place Firebase
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.projectId,
        clientEmail: process.env.clientEmail,
        privateKey:  key.replace(/\\n/g, '\n')
    }),
    databaseURL: "https://jarvis-773da.firebaseio.com/"
});

// Mise en place mongoose
var mongoose = require('mongoose');
var DeviceToken = mongoose.model('DeviceToken', new mongoose.Schema({
    token: String
}));

mongoose.connect(process.env.MONGODB_URI, function(error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

// Route envoyant une simple notification d'alerte
app.post('/alert', function(req, res) {

    // Récupérer le dernier token
    DeviceToken
    .findOne()
    .sort({'_id': -1})
    .exec(function(error, deviceToken) {
        if (error) {
            console.error(error);
            res.status(500);
        } else {
            // Envoyer la notification
            admin
            .messaging()
            .sendToDevice(deviceToken.token, payload)
            .then(function(res) {
                console.log("Success ! ", res);
                res.status(200).send("Success");
            })
            .catch(function(error){
                console.error("Error ! ", error);
            });
        }
    });
});

// Route permettant d'enregistrer un token dans la base de données
app.post('/registerToken', function(req,res) {

    // Vérification du paramètre
    if (req.body.deviceToken === undefined) {
        res.status(400);
    }

    // Création de l'objet à stocker
    var token = new DeviceToken({
        "token": req.body.deviceToken
    });

    // Stockage de l'objet
    token.save(function(error) {
        if (error) {
            console.error(error);
            res.status(500);
        } else {
            res.status(201).json(token);
        }
    });
});

// Debug affichage bdd token
app.get('/debug/displayAllTokens', function(req, res) {
    DeviceToken.find(function(error, tokens) {
        if (error) {
            console.error(error);
            res.status(500);
        }
        res.status(200).json(tokens);
    });
});

app.post('/updatePassword', function(req,res){

});

app.get('/', function(req, res) {
    res.send(port);
});

// Lancement de l'application
app.listen(port, function() {
    console.log('Running on port ' + port);
});
