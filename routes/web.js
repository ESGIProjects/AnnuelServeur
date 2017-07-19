module.exports = function(DeviceToken, SavedDate, port) {
    var express = require('express');
    var router = express.Router();
    
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

            // 3. Récupération de tous les tokens
            DeviceToken
            .find()
            .sort({'_id': -1})
            .exec(function(error, dbTokens) {

                // 4. Tableau de tokens exploitable par twig
                var tokens = [];

                for (var i = 0; i < dbTokens.length; i++) {
                    tokens.push({
                        token: dbTokens[i].token,
                        os: dbTokens[i].os
                    });
                }

                res.render('index.twig', {
                    port: port,
                    displayMode: displayMode,
                    alarms: alarms,
                    alarmsCount: dbDates.length,
                    tokens: tokens
                });
            });
        });
    });

    return router;
};
