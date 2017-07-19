module.exports = function(DeviceToken, SavedDate, admin) {
    var express = require('express');
    var router = express.Router();
    var request = require('request');

    // Route envoyant une simple notification d'alerte
    router.post('/alert', function(req, res) {

        // Récupérer le dernier token iOS
        DeviceToken
        .findOne({os: "ios"})
        .sort({'_id': -1})
        .exec(function(error, deviceToken) {
            if (error) {
                console.error(error);
                res.status(500);
            } else {
                // Notification payload
                var payload = {
                    notification: {
                        title: "Un mouvement a été détecté",
                        body: "Il se peut que quelqu'un soit à l'intérieur de votre domicile."
                    }
                };

                // Envoyer la notification
                admin
                .messaging()
                .sendToDevice(deviceToken.token, payload)
                .then(function(response) {
                    console.log("iOS Notification Success to " + deviceToken.token, response);
                    res.status(200).send("Notification Succes");
                })
                .catch(function(error){
                    console.error("iOS Notification Error !", error);
                });
            }
        });

        // Récupérer le dernier token Android
        DeviceToken
        .findOne({os: "android"})
        .sort({'_id': -1})
        .exec(function(error, deviceToken) {
            if (error) {
                console.error(error);
                res.status(500);
            } else {
                // Notification payload
                var payload = {
                    data: {
                        title: "Un mouvement a été détecté",
                        body: "Il se peut que quelqu'un soit à l'intérieur de votre domicile."
                    }
                };

                // Envoyer la notification
                admin
                .messaging()
                .sendToDevice(deviceToken.token, payload)
                .then(function(response) {
                    console.log("Android Notification Success to " + deviceToken.token, response);
                })
                .catch(function(error){
                    console.error("Android Notification Error !", error);
                });
            }
        });

        // Enregister la date
        var date = new SavedDate({
            'date': Date.now(),
            'reason': 'motion'
        });

        date.save(function(error) {
            if (error) {
                console.error(error);
            }
        });
    });

    // Route permettant d'enregistrer un token dans la base de données
    router.post('/registerToken', function(req,res) {

        // Vérification des paramètres
        if (req.body.deviceToken === undefined) {
            res.status(400);
        }

        if (req.body.os === undefined) {
            res.status(400);
        }

        // Création de l'objet à stocker
        var token = new DeviceToken({
            "token": req.body.deviceToken,
            "os": req.body.os
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

    return router;
};
