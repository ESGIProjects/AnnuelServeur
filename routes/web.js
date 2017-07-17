module.exports = function(port, SavedDate) {
    var express = require('express');
    var router = express.Router();
    var request = require('request');

    router.get('/test', function(req, res) {
        res.render('test.twig', {
            title: "Jarvis",
            port: port
        });
    });

    router.get('/:displayMode*?', function(req, res) {

        var displayMode;

        if (!req.params.displayMode) {
            displayMode = 1;
        }
        else {
            displayMode = req.params.displayMode;
        }

        var today = new Date();
        var startDate = new Date();

        if (displayMode == 1) {
            startDate.setDate(today.getDate() - 1);
        } else if (displayMode == 2) {
            startDate.setDate(today.getDate() - 7);
        }

        console.log(today, ', ', startDate);

        SavedDate
        .find({date: {'$gte': startDate, '$lt': today}})
        .exec(function(error, dbDates) {

            // 1. Faire tableau des jours
            var alarms = {};


            // 2. Faire tableau du nb d'alarmes par jr
            for (var i = 0; i < dbDates.length; i++) {
                var dateKey = dbDates[i].date.getDate() + '/' + (dbDates[i].date.getMonth()+1);

                if (dateKey in alarms) {
                    alarms[dateKey]++;
                } else {
                    alarms[dateKey] = 1;
                }
            }

            console.log(alarms);

            res.render('index.twig', {
                title: "Jarvis",
                port: port,
                displayMode: 1,
                alarms: alarms
            });
        });

    });

    return router;
};
