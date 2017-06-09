module.exports = function(DeviceToken, admin) {

    var express = require('express');
    var router = express.Router();

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
                  data: {
                        title: "Motion detected !",
                        body: "Somebody is in your house !"
                    }
                };

                // Envoyer la notification
                admin
                .messaging()
                .sendToDevice(deviceToken.token, payload)
                .then(function(response) {
                    console.log("Success ! ", response);
                    res.status(200).send("Success");
                })
                .catch(function(error){
                    console.error("Error !", error);
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

    router.post('/updatePassword', function(req,res){
        res.status(200).json({message:'password_okay_message'});
    });

    return router;

};
