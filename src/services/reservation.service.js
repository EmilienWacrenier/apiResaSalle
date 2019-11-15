const reservationBuilder = require('../builders/reservation.builder');
const recurrenceBuilder = require('../builders/recurrence.builder');
const mailService = require('./mail.service');

const moment = require('moment');
const momentTz = require('moment-timezone');

//Créer une réservation
module.exports.create_reservation = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Vérification de la présence des infos sur la réservation
            if (req.body.startDate == null || req.body.endDate == null || req.body.objet == null
                || req.body.salle_id == null || req.body.user_id == null) {
                return resolve({ code: 400, result: 'Un champs de réservation est nul' });
            }

            // Vérification de la présence des infos sur la récurrence
            if (req.body.libelleRecurrence != null && req.body.startDateRecurrence != null
                && req.body.endDateRecurrence != null) {

                // Vérification du libelleRecurrence
                if (req.body.libelleRecurrence == "quotidien" || req.body.libelleRecurrence == "hebdomadaire"
                    || req.body.libelleRecurrence == "mensuel" /*|| req.body.libelleRecurrence == "annuel"*/) {

                    // Création de la récurrence
                    var createdRecurrence = await recurrenceBuilder.create_recurrence(req)

                    // Vérification de la création de la récurrence
                    if (createdRecurrence.idRecurrence != null) {
                        var currentstartDate = new Date(req.body.startDate);
                        currentstartDate.setHours(currentstartDate.getHours() + 1)
                        var currentendDate = new Date(req.body.endDate);
                        currentendDate.setHours(currentendDate.getHours() + 1)
                        var endDateRecurrence = new Date(req.body.endDateRecurrence);
                        var nbResa = 0;

                        // Création des réservations associées à la récurrence
                        while (currentendDate < endDateRecurrence) {
                            // Ignorer les week-ends
                            if (!(currentstartDate.getDay() == 6 || currentstartDate.getDay() == 0)) {
                                var currentCreatedReservation = await reservationBuilder.createReservation(
                                    currentstartDate, currentendDate, req.body.objet, 1, req.body.user_id,
                                    createdRecurrence.idRecurrence, req.body.salle_id
                                );
                                nbResa++;
                            }

                            // Test du type de récurrence + incrémentation de la date
                            switch (createdRecurrence.libelle) {
                                case "quotidien":
                                    currentstartDate.setDate(currentstartDate.getDate() + 1);
                                    currentendDate.setDate(currentendDate.getDate() + 1);
                                    break;

                                case "hebdomadaire":
                                    currentstartDate.setDate(currentstartDate.getDate() + 7);
                                    currentendDate.setDate(currentendDate.getDate() + 7);
                                    break;

                                case "mensuel":
                                    currentstartDate.setMonth(currentstartDate.getMonth() + 1);
                                    currentendDate.setMonth(currentendDate.getMonth() + 1);
                                    break;

                                default:
                                    currentstartDate.setDate(currentstartDate.getDate() + 1);
                                    currentendDate.setDate(currentendDate.getDate() + 1);
                                    break;
                            }
                        }
                        return resolve({ code: 200, result: nbResa });
                    }
                }
                else {
                    return resolve({ code: 400, result: 'Libelle récurrence incorrect' });
                }
            }
            else {
                // Résa simple
                try {
                    var date = moment(req.body.startDate);
                    console.log(date.hour())

                    var createdReservation = await reservationBuilder.createReservation(
                        /*req.body.startDate*/date.toString(), req.body.endDate, req.body.objet, 1, req.body.user_id,
                        null, req.body.salle_id
                    );
                    return resolve({ code: 200, result: createdReservation });
                }
                catch (error) {
                    return resolve({ code: 400, result: error })
                }
            }
        } catch (err) {
            return resolve({
                code: 500,
                result: err
            });
        };
    })
};
//get all reservations
module.exports.get_reservations = () => {
    return new Promise(async (resolve, reject) => {
        const reservations = await reservationBuilder.findReservations();
        resolve({code:200,result:reservations});
    });
};
//get reservation by id
module.exports.get_reservation_by_id = (params) => {
    return new Promise(async (resolve, reject) => {
        const {
            id
        } = params;
        const reservation = await reservationBuilder.findReservationById(id);
        resolve({code:200,result:reservation});
    });
};
