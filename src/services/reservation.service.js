const reservationBuilder = require('../builders/reservation.builder');
const recurrenceBuilder = require('../builders/recurrence.builder');
// const mailService = require('./mail.service');
const userBuilder = require('../builders/user.builder');
const workingDaysService = require('../tools/services/workingDays.service');
const general = require('./general.service');

const REGEX = require('../tools/validation/regex');

const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = 'Europe/Paris'; //UTC+01:00

// A partir d'un tableau de userId envoyé dans la requête, retourne si certains id n'existent pas dans la BDD
module.exports.checkUsers = async (req) => {
    let toReturn = null
    if (req.body.users != null) {
        for (const idUser of req.body.users) {
            reqq = {
                query: {
                    userId: idUser
                }
            }
            var existingUser = await userBuilder.findUserById(reqq)
            console.log(existingUser)
            if (existingUser == null) {
                toReturn = { code: 400, result: 'User non trouve' };
            }
        }
    }
    return toReturn;
}

module.exports.create_resa_simple = async (req) => {
    let toResolve = { code: 400, result: "Une erreur est survenu lors de la création" }
    const dateDebut = momentTz.tz(req.body.startDate, 'YYYY-MM-DD HH:mm:ss');
    const dateFin = momentTz.tz(req.body.endDate, 'YYYY-MM-DD HH:mm:ss');
    // Présence de réservation entrant en conflit
    const existingResa = await reservationBuilder.findReservationByRoomByDate(
        req.body.roomId, dateDebut, dateFin
    )
    if (existingResa != null) {
        toResolve = { code: 400, result: 'Reservation déjà présente' };
    }
    else {
        var createdReservation = await reservationBuilder.createReservation(
            dateDebut, dateFin, req.body.object, 1, req.body.userId,
            null, req.body.roomId, req
        )
            .then(function (createdReservation) {
                toResolve = { code: 200, result: createdReservation };
            })
    }
    return toResolve
}

module.exports.create_reservation = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedUsers = await this.checkUsers(req)
            if (checkedUsers != null) { return resolve(checkedUsers) }

            const checkedBody = general.checkBody(req, ["startDate", "endDate", "object", "roomId", "userId"])
            if (checkedBody != null) {
                return resolve(checkedBody);
            }
            else if (req.body.object == "") {
                return resolve({ code: 400, result: "Le champs object est vide" })
            }

            // Vérification de la présence des infos sur la récurrence
            const checkedBodyRecurrence = general.checkBody(req, ["labelRecurrence", "startDateRecurrence", "endDateRecurrence"])
            if (checkedBodyRecurrence == null) {

                // Vérification du labelRecurrence
                if (req.body.labelRecurrence == "quotidien" || req.body.labelRecurrence == "hebdomadaire"
                    || req.body.labelRecurrence == "mensuel" /*|| req.body.labelRecurrence == "annuel"*/) {

                    // Création de la récurrence
                    var createdRecurrence = await recurrenceBuilder.create_recurrence(req)

                    // Vérification de la création de la récurrence
                    if (createdRecurrence.recurrenceId != null) {
                        var currentstartDate = new Date(req.body.startDate);
                        currentstartDate.setHours(currentstartDate.getHours() + 1)
                        var currentendDate = new Date(req.body.endDate);
                        currentendDate.setHours(currentendDate.getHours() + 1)
                        var endDateRecurrence = new Date(req.body.endDateRecurrence);

                        var listExistingResa = [];

                        // Création des réservations associées à la récurrence
                        while (currentendDate < endDateRecurrence) {
                            // Ignorer les week-ends
                            if (!(currentstartDate.getDay() == 6 || currentstartDate.getDay() == 0)) {
                                // Vérification de l'existance d'une reservation pour l'itération
                                const currentExistingResa = await reservationBuilder.findReservationByRoomByDate(
                                    req.body.roomId, currentstartDate, currentendDate
                                )
                                if (currentExistingResa != null) {
                                    listExistingResa.push(currentExistingResa);
                                }
                                else {
                                    var currentCreatedReservation = await reservationBuilder.createReservation(
                                        currentstartDate, currentendDate, req.body.object, 1, req.body.userId,
                                        createdRecurrence.recurrenceId, req.body.roomId, req
                                    );
                                }
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
                        return resolve({ code: 200, result: listExistingResa });
                    }
                }
                else {
                    return resolve({ code: 400, result: 'Libelle récurrence incorrect' });
                }
            }
            else {
                try {
                    return resolve(this.create_resa_simple(req))
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

module.exports.check_existing_reservation = async (roomId, startDate, endDate) => {
    let checkingExistingReservation = await reservationBuilder.checkReservation(roomId, startDate, endDate);
    if(!checkingExistingReservation){
        return true;
    }
    return checkingExistingReservation;
}

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

module.exports.get_reservation_by_id = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedParams = general.checkParam(req, ["reservationId"])
            if (checkedParams != null) {
                return resolve(checkedBody)
            }
            const reservation = await reservationBuilder.findReservationById(req.query.reservationId);
            return resolve({ code: 200, result: reservation });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_salles_booked_between = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedParams = general.checkParam(req, ["startDate", "endDate"])
            if (checkedParams != null) {
                return resolve(checkedParams);
            }
            if (REGEX.date.test(req.query.startDate) && REGEX.date.test(req.query.endDate)) {
                const sallesBookedBetween = await reservationBuilder.findSallesBookedBetween(
                    req.query.startDate, req.query.endDate
                );
                return resolve({ code: 200, result: sallesBookedBetween });
            } else {
                return resolve({ code: 400, result: "Les dates ne sont pas au bon format ! Utiliser le format TIMESTAMP : YYYY-MM-DD HH:mm:ss" });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
// get salles réservées par jour (body: date)
module.exports.get_salles_booked_by_day = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedParams = general.checkParam(req, ["startDate"]);
            if (checkedParams != null) {
                return resolve(checkedParams)
            }
            const sallesBookedByDay = await reservationBuilder.findSallesBookedByDay(req.query.startDate);
            return resolve({ code: 200, result: sallesBookedByDay });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//Get une réservation by salle_id between une startDate et une endDate
module.exports.get_salles_booked_by_id = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedParams = general.checkParam(req, ["roomId", "startDate", "endDate"]);
            if (checkedParams != null) {
                return resolve(checkedParams)
            }
            const sallesBookedById = await reservationBuilder.findSallesBookedById(req);
            return resolve({ code: 200, result: sallesBookedById });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_reservations_by_user_id = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedParams = general.checkParam(req, ["userId"]);
            if (checkedParams != null) {
                return resolve(checkedParams);
            }
            let listReservationWithParticipants = [];
            const reservationsByUserId = await reservationBuilder.findReservationsByUserId(req);

            for (var reservation of reservationsByUserId) {
                const listParticipant = await reservationBuilder.findParticipantsByReservationId(
                    reservation.reservationId
                )
                currentReservation = reservation
                currentReservation.dataValues["participants"] = listParticipant;
                listReservationWithParticipants.push(currentReservation);
            }
            //console.log(listReservationWithParticipants)
            return resolve({ code: 200, result: reservationsByUserId });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_participants_by_reservation_id = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedParams = general.checkParam(req, ["reservationId"]);
            if (checkedParams != null) {
                return resolve(checkedParams);
            }
            const participants = await reservationBuilder.findParticipantsByReservationId(req.query.reservationId);
            return resolve({ code: 200, result: participants })
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

module.exports.delete_reservation = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedParams = general.checkParam(req, ["reservationId"]);
            if (checkedParams != null) {
                return resolve(checkedParams);
            }
            const deleteRes = await reservationBuilder.destroyReservation(req.query.reservationId);
            if (deleteRes) {
                return resolve({ code: 200, result: 'Suppression effectué' });
            }
            else {
                return resolve({ code: 400, result: 'Erreur lors de la suppression' });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

module.exports.modify_reservation = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedBody = general.checkBody(req, ["startDate", "endDate", "object", "roomId", "reservationId"])
            if(checkedBody != null){
                return resolve(checkedBody);
            }
            else if (req.body.object == "") {
                return resolve({ code: 400, result: "Le champs object est vide" })
            }
            else if( null /*check s'il y a deja une resa */) {
                return resolve({ code: 403, result : "Il y a dejà une réservation"})
            }
            else{
                const modifyReservation = await reservationBuilder.modifyReservation(req);
                return resolve({ code: 200, result: modifyReservation });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}
//******************************************************************************
// TEST DECOUPE DES FONCTIONS
//******************************************************************************

//Créer une réservation
module.exports.create_booking = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Récupération des paramètres de requête
            var startDate = req.body.startDate; // date de début
            var endDate = req.body.endDate; //date de fin
            var object = req.body.object; // objet de la réunion
            var roomId = req.body.roomId; //id de la salle réservée
            var userId = req.body.userId; // id du créateur de la réunion
            var users = req.body.users; // id des participants
            const dateDebut = momentTz.tz(startDate, 'YYYY-MM-DD HH:mm:ss');
            const dateFin = momentTz.tz(endDate, 'YYYY-MM-DD HH:mm:ss');
            // Présence de réservation entrant en conflit
            const existingResa = await reservationBuilder.findReservationByRoomByDate(
                roomId, dateDebut, dateFin
            )
            if (existingResa != null) {
                console.log("bonjour")
                return resolve({ code: 400, result: 'Reservation déjà présente' });
            }
            var createdReservation = await reservationBuilder.createReservation(
                dateDebut, dateFin, object, 1, userId,
                null, roomId, req
            )
                .then(function (createdReservation) {
                    return resolve({ code: 200, result: createdReservation });
                })
        } catch (error) {
            return resolve({ code: 400, result: error })
        }
    });
}
