const reservationBuilder = require('../builders/reservation.builder');
const recurrenceBuilder = require('../builders/recurrence.builder');
const mailService = require('./mail.service');
const userBuilder = require('../builders/user.builder');

const REGEX = require('../tools/validation/regex');

const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = 'Europe/Paris'; //UTC+01:00

//Créer une réservation
module.exports.create_reservation = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Vérification des userId 
            for(const idUser of req.body.users){
                reqq = {
                    body: {
                        userId: idUser
                    }
                }
                var existingUser = await userBuilder.findUserById(reqq)
                if (existingUser == null) {     
                    return resolve({ code: 400, result: 'User non trouve' });
                }
            }

            // Vérification de la présence des infos sur la réservation
            if (req.body.startDate == null || req.body.endDate == null || req.body.objet == null
                || req.body.objet == ""
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
                    const dateDebut = momentTz.tz(req.body.startDate, 'YYYY-MM-DD HH:mm:ss', timeZone);
                    const dateFin = momentTz.tz(req.body.endDate, 'YYYY-MM-DD HH:mm:ss', timeZone);
                    var createdReservation = await reservationBuilder.createReservation(
                        dateDebut, dateFin, req.body.objet, 1, req.body.user_id,
                        null, req.body.salle_id, req
                    )
                        .then(function (createdReservation) {
                            return resolve({ code: 200, result: createdReservation });
                        })
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
        try {
            const reservations = await reservationBuilder.findReservations();
            return resolve({ code: 200, result: reservations });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//get reservation by id
module.exports.get_reservation_by_id = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
<<<<<<< HEAD
            const reservation = await reservationBuilder.findReservationById(req);
            return resolve({ code: 200, result: reservation });
=======
            const {
                id
            } = params; //params du header
            const reservation = await reservationBuilder.findReservationById(id);
            return resolve({ code:200, result:reservation });
>>>>>>> 0083e9566ad2d818cba618d8c5cb4e75525d86a3
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//get les salles occupées entre startDate et endDate
module.exports.get_salles_booked_between = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
<<<<<<< HEAD
            if (!req.body.startDate || !req.body.endDate) {
                return reject({ code: 400, result: "Il manque une startDate ou une endDate !" });
            }
            if (REGEX.date.test(req.body.startDate) && REGEX.date.test(req.body.endDate)) {
                const sallesBookedBetween = await reservationBuilder.findSallesBookedBetween(req);
                return resolve({ code: 200, result: sallesBookedBetween });
=======
            const {
                startDate,
                endDate
            } = params; //params du header
            if (!startDate || !endDate) {
                return reject({ code:400, result:"Il manque une startDate ou une endDate !"});
            }
            if (REGEX.date.test(startDate) && REGEX.date.test(endDate)) {
                const sallesBookedBetween = await reservationBuilder.findSallesBookedBetween(startDate,endDate);
                return resolve({ code:200, result:sallesBookedBetween });
>>>>>>> 0083e9566ad2d818cba618d8c5cb4e75525d86a3
            } else {
                return reject({ code: 400, result: "Les dates ne sont pas au bon format ! Utiliser le format TIMESTAMP : YYYY-MM-DD HH:mm:ss" });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
// get salles réservées par jour (body: date)
module.exports.get_salles_booked_by_day = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
<<<<<<< HEAD
            const sallesBookedByDay = await reservationBuilder.findSallesBookedByDay(req);
            return resolve({ code: 200, result: sallesBookedByDay });
=======
            const {
                startDate
            } = params; //params du header
            const sallesBookedByDay = await reservationBuilder.findSallesBookedByDay(startDate);
            return resolve({ code:200, result:sallesBookedByDay });
>>>>>>> 0083e9566ad2d818cba618d8c5cb4e75525d86a3
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//Get une réservation by salle_id between une startDate et une endDate
module.exports.get_salles_booked_by_id = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
<<<<<<< HEAD
            const sallesBookedById = await reservationBuilder.findSallesBookedById(req);
            return resolve({ code: 200, result: sallesBookedById });
=======
            const {
                salleId,
                startDate,
                endDate
            } = params; //params du header
            const sallesBookedById = await reservationBuilder.findSallesBookedById(salleId, startDate, endDate);
            return resolve({ code:200, result:sallesBookedById });
>>>>>>> 0083e9566ad2d818cba618d8c5cb4e75525d86a3
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
module.exports.get_reservations_by_user_id = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reservationsByUserId = await reservationBuilder.findReservationsByUserId(req);
            return resolve({ code: 200, result: reservationsByUserId });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_participants_by_reservation_id = (req) =>{
    return new Promise(async (resolve, reject) => {
        try {
            console.log(req.headers['reservation_id']);
            const participants = await reservationBuilder.findParticipantsByReservationId(req.headers['reservation_id']);
            return resolve({code: 200, result: participants})
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}
