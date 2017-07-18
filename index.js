// Dépendances
var express = require("express");
var admin = require("firebase-admin");
var bodyParser = require('body-parser');

// Nécessaire pour laisser Heroku contrôler le port
var port = process.env.PORT || 8080;
var app = express();

// Middleware pour parser les requêtes POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})) ;

// Moteur de template
app.set('view engine', 'twig');
app.use(express.static(__dirname + '/resources'));

// Mise en place Firebase
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.projectId,
        clientEmail: process.env.clientEmail,
        privateKey:  process.env.privateKey.replace(/\\n/g, '\n')
    }),
    databaseURL: "https://jarvis-773da.firebaseio.com/"
});

// Mise en place mongoose
var mongoose = require('mongoose');
var DeviceToken = mongoose.model('DeviceToken', new mongoose.Schema({
    token: String,
    os: String
}));

var SavedDate = mongoose.model('SavedDate', new mongoose.Schema({
    date: Date,
    reason: String
}));

mongoose.connect(process.env.MONGODB_URI, function(error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.use('/', require('./routes/web')(DeviceToken, SavedDate, port));
app.use('/api/', require('./routes/api')(DeviceToken, SavedDate, admin));

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


// Lancement de l'application
app.listen(port, function() {
    console.log('Running on port ' + port);
});
