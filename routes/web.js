module.exports = function(port) {
    var express = require('express');
    var router = express.Router();
    var request = require('request');

    router.get('/', function(req, res) {
        res.render('index.twig', {
            title: "Jarvis",
            port: port
        });
    });

    router.get('/updatePassword', function(req, res) {
        res.render('update.twig', {
            displayError: false
        });
    });

    router.post('/updatePassword', function(req, res) {

        if (req.body.password == req.body.confirmPassword) {
            request.post('http://localhost:8080/api/updatePassword', function(error, response, body) {
                    console.log(response.statusCode);
            });
            res.send("Password okay!");
        } else {
            res.render('update.twig', {
                displayError: true,
                errorMessage: "Les mots de passe doivent être identiques !"
            });
        }
    });

    return router;
};
