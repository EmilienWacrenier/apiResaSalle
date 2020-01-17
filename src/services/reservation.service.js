const reservationBuilder = require('../builders/reservation.builder');
const recurrenceBuilder = require('../builders/recurrence.builder');
// const mailService = require('./mail.service');
const userBuilder = require('../builders/user.builder');
const salleBuilder = require('../builders/salle.builder');

const workingDaysService = require('../tools/services/workingDays.service');
const general = require('./general.service');

const REGEX = require('../tools/validation/regex');

const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = 'Europe/Paris'; //UTC+01:00

function checkLastDayMonth(currentDate, originDay) {
    let m = moment(new Date());

    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth()+2, 0);
    lastDay.setHours(currentDate.getHours());
    lastDay.setMinutes(currentDate.getMinutes());
    
    let newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    if (newDate > lastDay) {
        console.log(lastDay.toDateString())
        return lastDay;
    } else {
        if (newDate.getDate() < originDay.getDate()) {
            if (originDay.getDate() >= lastDay.getDate()) {
                newDate.setDate(lastDay.getDate());
            }
            else if(originDay.getDate() < currentDate.getDate()){
                newDate.setDate(originDay.getDate())
            }
        }
        console.log(newDate.toDateString())
        return newDate;
    }
}

module.exports.create_simple_reservation = async (startDate, endDate, object, userId, roomId) => {
    return new Promise(async (resolve, reject) => {
        let checkedReservation = await this.check_existing_reservation(roomId, 
            moment(startDate, "YYYY-MM-DD HH:mm:ss").toISOString(), moment(endDate, "YYYY-MM-DD HH:mm:ss").toISOString());
        if (!checkedReservation[0]) {
            let createdReservation = await reservationBuilder.createReservation(startDate, endDate, object, 1, userId, null, roomId);
            return resolve({code: 200, result: createdReservation})
        }else{
            return resolve({code: 400, result: checkedReservation});
        }
    })
}

module.exports.check_recurrence = async (startDate, endDate, roomId, labelRecurrence, endDateRecurrence) => {
    return new Promise(async (resolve, reject) => {
        var reservationsToReturn = [];
        var currentStartDate = new Date(startDate);
        var currentEndDate = new Date(endDate);
        const currentEndDateRecurrence = new Date(endDateRecurrence)


        do {
            var currentReservation = await this.check_existing_reservation(roomId,
                moment(currentStartDate).format("YYYY-MM-DD HH:mm:ss").toString(), moment(currentStartDate).format("YYYY-MM-DD HH:mm:ss").toString());
            if (!currentReservation[0]) {
                reservationsToReturn.push({ startDate: new Date(currentStartDate), endDate: new Date(currentEndDate), conflit: false, roomId: roomId })
            }
            else {
                console.log(currentReservation)
                reservationsToReturn.push({ startDate: currentReservation[0].startDate, endDate: currentReservation[0].endDate, conflit: true, email: currentReservation[0].email })
            }

            switch (labelRecurrence) {
                case "quotidien":
                    currentStartDate.setDate(currentStartDate.getDate() + 1);
                    currentEndDate.setDate(currentEndDate.getDate() + 1);
                    break;

                case "hebdomadaire":
                    currentStartDate.setDate(currentStartDate.getDate() + 7);
                    currentEndDate.setDate(currentEndDate.getDate() + 7);
                    break;

                case "mensuel":
                    currentStartDate = checkLastDayMonth(currentStartDate, new Date(startDate));
                    currentEndDate = checkLastDayMonth(currentEndDate, new Date(endDate));
/*                     currentStartDate.setMonth(currentStartDate.getMonth() + 1);
                    currentEndDate.setMonth(currentEndDate.getMonth() + 1);
                    console.log("\n"+currentStartDate); */
                    break;

                default:
                    currentStartDate.setDate(currentStartDate.getDate() + 1);
                    currentEndDate.setDate(currentEndDate.getDate() + 1);
                    break;
            }

        } while (currentEndDate <= currentEndDateRecurrence);

        return resolve({ code: 200, result: reservationsToReturn })
    })
}

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

    const existingResa = await this.check_existing_reservation(
        req.body.roomId, dateDebut, dateFin
    )
    //console.log(existingResa)

    if (existingResa != true) {

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

//check si le tableau est null ou un element des réservation est pas bon
//return false si vide ou pas de tableau ou pas format tableau
//return un tableau s'il y a un probleme dans les parametres
//return true si pas de probleme
module.exports.check_param_reservation_recurrence = async (req) => {
    return new Promise(async (resolve, reject) => {
        let checkedBody = general.checkBody(req, ["listeReservations"]);
        if (checkedBody != null) {
            return resolve(checkedBody);
        }
        let listeReservations = req.body.listeReservations;
        //1- check le tableau est vide 
        if (listeReservations != null) {

            for (let reservation of listeReservations) {
                //2- check si les parametres de reservation sont bons (non null et dans le bon format)
                let paramIssue = [];
                if (reservation.startDate == null || reservation.startDate == "" || !REGEX.date.test(reservation.startDate)) {
                    paramIssue.push(reservation.startDate);
                }
                if (reservation.endDate == null || reservation.endDate == "" || !REGEX.date.test(reservation.endDate)) {
                    paramIssue.push(reservation.endDate);
                }
                if (reservation.object == null || reservation.object == "") {
                    paramIssue.push(reservation.object);
                }
                /*                 if (reservation.state == null || reservation.state != false || reservation.state != true) {
                                    paramIssue.push(state);
                                } */
                if (reservation.user_id == null || reservation.user_id == "" /*|| CONTROLE SI USER EST EN BASE */) {
                    paramIssue.push(reservation.user_id);
                }
                if (reservation.room_id == null || reservation.room_id == "" || await salleBuilder.findSalle(reservation.room_id == null)) {
                    paramIssue.push(reservation.room_id);
                }
                if (paramIssue.isArray && paramIssue.length > 0) {
                    return resolve({ code: 400, result: paramIssue });
                }
                else return resolve(
                    { code: 200, result: "Ok" }
                );
            }
        }
        else return resolve({ code: 400, result: "le tableau est vide" });
    })
}

//check les reservations par recurrences si elles sont en conflit ou pas
//retourne un tableau avec toutes les réservations
// les réservations qui sont en conflits ont une nouvelle clé "isConflict" avec la valeur true
module.exports.check_existing_reservation_recurrence = async (req) => {
    return new Promise(async (resolve, reject) => {
        let listeReservations = req.body.listeReservations;
        let codeToResolve = 200;
        let reservationsConflictOrNot = [];

        for (let reservation of listeReservations) {
            reservation.isConflict = false
            reservation.startDate = moment(reservation.startDate, "YYYY-MM-DD HH:mm:ss").toISOString();
            reservation.endDate = moment(reservation.endDate, "YYYY-MM-DD HH:mm:ss").toISOString();
            console.log(reservation.startDate)
            let checkReservationIfTaken = await this.check_existing_reservation(reservation.room_id, reservation.startDate, reservation.endDate)
            if (checkReservationIfTaken[0] !== undefined) {
                codeToResolve = 400;
                reservation.isConflict = true;
            }
            reservationsConflictOrNot.push(reservation);
        }
        return resolve({ code: codeToResolve, result: reservationsConflictOrNot });
    })
}


module.exports.check_existing_reservation = async (roomId, startDate, endDate) => {
    let checkingExistingReservation = await reservationBuilder.checkReservation(roomId, startDate, endDate);
    //console.log(checkingExistingReservation)
    if (!checkingExistingReservation) {
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
        const checkedBody = general.checkBody(req, ["startDate", "endDate", "object", "roomId", "reservationId"])
        if (checkedBody != null) {
            return resolve(checkedBody);
        }
        else if (req.body.object == "") {
            return resolve({ code: 400, result: "Le champs object est vide" })
        }
        else if (null /*check s'il y a deja une resa */) {
            return resolve({ code: 403, result: "Il y a dejà une réservation" })
        }
        else {
            const modifyReservation = await reservationBuilder.modifyReservation(req)
                .then(function (modifyReservation) {
                    if (modifyReservation != null) {
                        return resolve({ code: 200, result: 'Réservation mise à jour' });
                    }
                }).catch(function (err) {
                    return reject(err);
                })
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
