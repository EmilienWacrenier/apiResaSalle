const reservationBuilder = require('../builders/reservation.builder');
const recurrenceBuilder = require('../builders/recurrence.builder');
const userBuilder = require('../builders/user.builder');
const salleBuilder = require('../builders/salle.builder');

const workingDaysService = require('../tools/services/workingDays.service');
const general = require('./general.service');

const REGEX = require('../tools/validation/regex');

const moment = require('moment');
const momentTz = require('moment-timezone');


// GET
module.exports.check_recurrence = async (startDate, endDate, roomId, labelRecurrence, endDateRecurrence) => {
    return new Promise(async (resolve, reject) => {
        var reservationsToReturn = [];
        var currentStartDate = new Date(startDate);
        var currentEndDate = new Date(endDate);
        const currentEndDateRecurrence = new Date(endDateRecurrence)

        do {
            const currentRoom = await salleBuilder.findSalle(roomId);            
            var currentReservation = await this.check_existing_reservation(roomId,
                moment(currentStartDate).format("YYYY-MM-DD HH:mm:ss").toString(), moment(currentEndDate).format("YYYY-MM-DD HH:mm:ss").toString());
            if (!currentReservation[0]) {
                if(workingDaysService.is_working_day(moment(currentStartDate).format("YYYY-MM-DD HH:mm:ss").toString())){
                    reservationsToReturn.push({ startDate: moment(currentStartDate).format("YYYY-MM-DD HH:mm:ss").toString(), 
                    endDate: moment(currentEndDate).format("YYYY-MM-DD HH:mm:ss").toString(), conflit: false, workingDay: true, room_id: roomId, roomName: currentRoom.name })
                }
                else{
                    reservationsToReturn.push({ startDate: moment(currentStartDate).format("YYYY-MM-DD HH:mm:ss").toString(), 
                    endDate: moment(currentEndDate).format("YYYY-MM-DD HH:mm:ss").toString(), conflit: false, workingDay: false, room_id: roomId, roomName: currentRoom.name })
                }

            }
            else {
                reservationsToReturn.push({ startDate: moment(currentReservation[0].startDate).format("YYYY-MM-DD HH:mm:ss").toString(), 
                endDate: moment(currentReservation[0].endDate).format("YYYY-MM-DD HH:mm:ss").toString(), roomName: currentReservation[0].room.name, room_id: roomId, conflit: true, workingDay: true, email: currentReservation[0].email })
            }

            switch (labelRecurrence) {
                case "quotidienne":
                    currentStartDate.setDate(currentStartDate.getDate() + 1);
                    currentEndDate.setDate(currentEndDate.getDate() + 1);
                    break;

                case "hebdomadaire":
                    currentStartDate.setDate(currentStartDate.getDate() + 7);
                    currentEndDate.setDate(currentEndDate.getDate() + 7);
                    break;

                case "mensuelle":
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

module.exports.check_existing_reservation = async (roomId, startDate, endDate) => {
    var checkingExistingReservation = await reservationBuilder.checkReservation(roomId, startDate, endDate);
    if (!checkingExistingReservation) {
        return true;
    }
    /*checkingExistingReservation.forEach(element => {
        element.startDate = moment(element.startDate).format("YYYY-MM-DD HH:mm:ss").toString()
        element.endDate = moment(element.endDate).format("YYYY-MM-DD HH:mm:ss").toString()
    });*/
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

module.exports.get_salles_booked_by_day = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sallesBookedByDay = await reservationBuilder.findSallesBookedByDay(req.query.startDate);
            return resolve({ code: 200, result: sallesBookedByDay });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_salles_booked_by_id = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
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


// POST
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


// PUT
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


// DELETE
module.exports.delete_reservation = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
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


// CHECK PARAM
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


// ANNEXE
function checkLastDayMonth(currentDate, originDay) {
    let m = moment(new Date());

    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth()+2, 0);
    lastDay.setHours(currentDate.getHours());
    lastDay.setMinutes(currentDate.getMinutes());
    
    let newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    if (newDate > lastDay) {
        return lastDay;
    } else {
        if (newDate.getDate() < originDay.getDate()) {
            if (originDay.getDate() >= lastDay.getDate()) {
                newDate.setDate(lastDay.getDate());
            }
            else if(originDay.getDate() < currentDate.getDate()){
                newDate.setDate(originDay.getDate())
            }
            else if(originDay.getDate() > currentDate.getDate()){
                newDate.setDate(originDay.getDate())
            }
        }
        return newDate;
    }
}

module.exports.check_existing_reservation_recurrence = async (req) => {
    return new Promise(async (resolve, reject) => {
        let listeReservations = req.body.listeReservations;
        let codeToResolve = 200;
        let reservationsConflictOrNot = [];

        for (let reservation of listeReservations) {
            reservation.isConflict = false
            reservation.startDate = moment(reservation.startDate, "YYYY-MM-DD HH:mm:ss").toISOString();
            reservation.endDate = moment(reservation.endDate, "YYYY-MM-DD HH:mm:ss").toISOString();
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
