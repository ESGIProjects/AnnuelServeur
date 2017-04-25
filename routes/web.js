module.exports = function(port) {
    var express = require('express');
    var router = express.Router();

    router.get('/', function(req, res) {
        res.render('index.twig', {
            title: "Jarvis",
            port: port
        });
    });

    return router;
};
