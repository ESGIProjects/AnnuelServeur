module.exports = function(DeviceToken, SavedDate, admin) {
    var express = require('express');
    var router = express.Router();
    var request = require('request');

    // Route envoyant une simple notification d'alerte
    router.post('/alert', function(req, res) {

        // Récupérer le dernier token
        DeviceToken
        .findOne()
        .sort({'_id': -1})
        .exec(function(error, deviceToken) {
            if (error) {
                console.error(error);
                res.status(500);
            } else {
                // Notification payload
                var payload = {
                    alert: {
                        title: "Un mouvement a été détecté",
                        body: "Il se peut que quelqu'un soit à l'intérieur de votre domicile."
                    }
                };

                // Envoyer la notification
                admin
                .messaging()
                .sendToDevice(deviceToken.token, payload)
                .then(function(response) {
                    console.log("Notification Success to " + deviceToken.token, response);
                    res.status(200).send("Notification Succes");
                })
                .catch(function(error){
                    console.error("Notification Error !", error);
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
            }
        });
    });

    // Route permettant d'enregistrer un token dans la base de données
    router.post('/registerToken', function(req,res) {

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

    router.post('/updatePassword', function(req,res) {


        res.status(200).json({message:'password_okay_message'});
    });

    // Route permettant au smartphone de vérifier le statut de l'alarme
    router.post('/alamStatus', function(req, res) {
        request.post('ARDUINO URL', function(error, response, body) {
            if (error) {
                console.error(error);
                res.status(500);
            } else {
                res.status(200).json(body);
            }
        });
    });

    // Route permettant au smartphone de désactiver l'alarme
    router.post('/disableAlarm', function(req, res) {
        // Envoi de la demande à l'Arduino

        request.post('ARDUINO URL', req.body, function(error, response, body) {
            if (error) {
                console.error(error);
                res.status(500);
            } else {
                // Enregister la date
                var date = new SavedDate({
                    'date': Date.now(),
                    'reason': 'disable'
                });

                date.save(function(error) {
                    if (error) {
                        console.error(error);
                    }
                });

                res.status(200).json(body);
            }
        });
    });

    // Route permettant au smartphone d'activer l'alarme
    router.post('/enableAlarm', function(req, res) {
        // Envoi de la demande à l'Arduino

        request.post('ARDUINO URL', req.body, function(error, response, body) {
            if (error) {
                console.error(error);
                res.status(500);
            } else {

                // Enregister la date
                var date = new SavedDate({
                    'date': Date.now(),
                    'reason': 'enable'
                });

                date.save(function(error) {
                    if (error) {
                        console.error(error);
                    }
                });

                res.status(200).json(body);
            }
        });
    });

    router.post('/saveDate', function(req, res) {

        if (req.body.reason === undefined) {
            res.status(400);
        }

        var reason = req.body.reason

        var date = new SavedDate({
            'date': Date.now(),
            'reason': reason
        });

        date.save(function(error) {
            if (error) {
                console.error(error);
                res.status(301);
            } else {
                res.status(201);
            }
        });
    });

    return router;
};
