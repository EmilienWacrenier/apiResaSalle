const reservationService = require('../services/reservation.service');
const reservationBuilder = require('../builders/reservation.builder')
const workingDaysService = require('../tools/services/workingDays.service');
const recurrenceBuilder = require('../builders/recurrence.builder');
// const mailService = require('../services/mail.service');
const testParamService = require('../tools/services/test_params.service');
const recurrenceService = require('../services/recurrence.service');
const generalService = require('../services/general.service');
const userService = require('../services/user.service');
const salleService = require('../services/salle.service');
const REGEX = require('../tools/validation/regex');

exports.creerReservation = async (req, res) => {
    let data = await reservationService.create_reservation(req);
    return res.status(data.code).json({ result: data.result });
};

exports.getReservations = async (req, res) => {
    let data = await reservationService.get_reservations();
    return res.status(data.code).json({ result: data.result });
}

exports.getReservationById = async (req, res) => {
    const checkedParams = generalService.checkParam(req, ["reservationId"])
    if (checkedParams != null) {
        return res.status(checkedParams.code).json({result: checkedParams.result});
    }
    let data = await reservationService.get_reservation_by_id(req);
    return res.status(data.code).json({ result: data.result });
}

exports.getSallesBookedBetween = async (req, res) => {
    let data = await reservationService.get_salles_booked_between(req);
    return res.status(data.code).json({ result: data.result });
}
exports.getSallesBookedByDay = async (req, res) => {
    const checkedParams = generalService.checkParam(req, ["startDate"]);
    if (checkedParams != null) {
        return res.status(checkedParams.code).json({result: checkedParams.result});
    }
    if(!REGEX.dateDay.test(req.query.startDate)){
        return res.status(400).json({result: "La date n'est pas au bon formats"});
    }
    let data = await reservationService.get_salles_booked_by_day(req);
    return res.status(data.code).json({ result: data.result });
}

exports.getReservationByRoomId = async (req, res) => {
    const checkedParams = generalService.checkParam(req, ["roomId", "startDate", "endDate"]);
    if (checkedParams != null) {
        return res.status(checkedParams.code).json({result: checkedParams.result});
    }
    if(!REGEX.date.test(req.query.startDate) || !REGEX.date.test(req.query.endDate)){
        return res.status(400).json({result: "Les dates ne sont pas au bon formats"});
    }
    let data = await reservationService.get_salles_booked_by_id(req);
    return res.status(data.code).json({ result: data.result });
}

exports.getReservationsByUserId = async (req, res) => {
    let data = await reservationService.get_reservations_by_user_id(req);
    return res.status(data.code).json({ result: data.result });
}

exports.checkReservation = async (req, res) => {
    const checkedParams = generalService.checkParam(req, ["roomId", "startDate", "endDate"]);
    if(checkedParams != null){
        return res.status(checkedParams.code).json({result: checkedParams.result});
    }
    if(!REGEX.date.test(req.query.startDate) || !REGEX.date.test(req.query.endDate)){
        return res.status(400).json({result: "Les dates ne sont pas au bon formats"});
    }
    let data = await reservationService.check_existing_reservation(req.query.roomId, req.query.startDate, req.query.endDate);
    if(!data[0]){
        return res.status(200).json({result: "Le créneau de réservation est disponible"})
    }
    else{
        return res.status(400).json({result: data})
    }
}

exports.checkRecurrence = async (req, res) => {
    let checkedParams = generalService.checkParam(req, ["startDate", "endDate", "roomId", "labelRecurrence", "endDateRecurrence"]);
    if(checkedParams != null){
        return res.status(400).json({result: checkedParams})
    }
    if(!REGEX.date.test(req.query.startDate) || !REGEX.date.test(req.query.endDate) || !REGEX.date.test(req.query.endDateRecurrence)){
        return res.status(400).json({result: "Les dates ne sont pas au bon formats"});
    }
    if(isNaN(req.query.roomId)){
        return res.status(400).json({result: "RoomId n'est pas un chiffre"})
    }
    if((req.query.labelRecurrence != "quotidienne" && req.query.labelRecurrence != "mensuel" && req.query.labelRecurrence != "hebdomadaire")){
        return res.status(400).json({result: "Le label est incorrect"});
    }
    let data = await reservationService.check_recurrence(
        req.query.startDate, req.query.endDate, req.query.roomId, req.query.labelRecurrence, req.query.endDateRecurrence
    )
    return res.status(data.code).json({result: data.result});
    }

exports.modifyReservation = async (req, res) => {
    let data = await reservationService.modify_reservation(req);
    return res.status(data.code).json({ result: data.result });
}

exports.createSimpleReservation = async (req, res) => {
    let checkedBody = generalService.checkBody(req, ["startDate", "endDate", "object", "userId", "roomId"]);
    if(checkedBody != null){
        return res.status(400).json({result: checkedBody});
    }else{
        if(!REGEX.date.test(req.body.startDate) || !REGEX.date.test(req.body.endDate)){
            return res.status(400).json({result: "Les dates ne sont pas au bon formats"});
        }
        if (userService.check_user_id(req.body.userId) === false){
            return res.status(400).json({result: "L'id utilisateur: " + req.body.userId + " n'existe pas"})
        }
        if (salleService.check_room_id(req.body.roomId) === false){
            return res.status(400).json({result: "L'id room: " + req.body.roomId + " n'existe pas"});
        }
        let createdReservation = await reservationService.create_simple_reservation(req.body.startDate, req.body.endDate, req.body.object
            , req.body.userId, req.body.roomId);
        return res.status(createdReservation.code).json({result: createdReservation.result});
    }
}

exports.createRecurrence = async (req, res) => {
/*     let data = await reservationBuilder.insertMultipleReservation(req.body.listReservation);
    return res.status(200).json(data) */
    let checkParam = await reservationService.check_param_reservation_recurrence(req);
    if(checkParam.code == 200){
        let creneauxDispo = await reservationService.check_existing_reservation_recurrence(req);
        if (creneauxDispo.code == 200) {
            let checkBodyRecurrence = generalService.checkBody(req, ["labelRecurrence", "startDateRecurrence", "endDateRecurrence"]);
            if(checkBodyRecurrence != null){
                return res.status(checkBodyRecurrence.code).json({result: checkBodyRecurrence.result});
            }
            let recurrence = await recurrenceService.insertRecurrence(req.body.labelRecurrence, req.body.startDateRecurrence, req.body.endDateRecurrence);
            creneauxDispo.result.forEach(elem => {
                elem.recurrence_id = recurrence;
            });
            reservationBuilder.insertMultipleReservation(creneauxDispo.result)
            return res.status(creneauxDispo.code).json({result: creneauxDispo.result})
        }
        else{
            return res.status(creneauxDispo.code).json({result: creneauxDispo.result})
        }
    }
    else{
        return res.status(checkParam.code).json(checkParam.result)
    }
}

//test isFreeDate
exports.isFreeDate = async (req, res) => {
    try {
        let data1 = await reservationService.get_salles_booked_between(req);
        if (!data1.result) {
            console.log('la salle est libre (controller: get_salles_booked_between) : ' + data1.result);
            return res.status(data1.code).json({ result: data1.result });
        } else {
            console.log('la salle est occupée (controller: get_salles_booked_between) : ' + data1.result);
            let data2 = await workingDaysService.is_free_date(req);
            if (!!data2) {
                console.log('la salle est libre (controller: is_free_date) : ' + data2.result);
                return res.status(data2.code).json({ result: data2.result });
            } else {
                console.log('erreur à gérer');
                return res.status(data2.code).json({ result: data2.result });
            }
        }
        return res.status(data2.code).json({ result: data2.result });
    } catch (error) {
        console.log(error);
        reject(error);
    }
}
//test isWorkingDay
exports.isWorkingDay = (req, res) => {
    let data = workingDaysService.is_working_day(req);
    console.log(data);
    return res.status(data.code).json({ result: data.result });
}
//test isWeekEnd
exports.isWeekEnd = async (req, res) => {
    let data = await workingDaysService.is_week_end(req);
    return console.log(data);
    return data.toString();
}
//test isFerie
exports.isFerie = (req) => {
    let data = workingDaysService.is_ferie(req);
    return console.log(data);
    return data.toString();
}

exports.getParticipantsByIdReservation = async (req, res) => {
    let data = await reservationService.get_participants_by_reservation_id(req);
    return res.status(data.code).json({ result: data.result });
}

exports.deleteReservation = async (req, res) => {
    const checkedParams = generalService.checkParam(req, ["reservationId"]);
    if (checkedParams != null) {
        return res.status(checkedParams.code).json({result: checkedParams.result});
    }
    if(isNaN(req.query.reservationId)){
        return res.status(400).json({result: "L'id n'est pas un nombre"})
    }
    let data = await reservationService.delete_reservation(req);
    return res.status(data.code).json({ result: data.result });
}
//******************************************************************************
// TEST DECOUPE DES FONCTIONS
//******************************************************************************
exports.createBooking = async (req, res) => {
    //Vérifier la validité des paramètres
    let testParam = await testParamService.test_params_booking(req);
    console.log('testParam code (controller) :' + testParam.code);
    if (testParam.code == 400) {
        return res.status(testParam.code).json({ result: testParam.result });
    }
    let testParamRecurrence = await testParamService.test_params_recurrence(req);
    //Créer la réservation avec récurrence
    if (testParamRecurrence.code == 200) {
        //Vérif des conflits (date, salle, ...) pour les dates récurrentes
        //TODO avec working days service
        //créer de la réservation avec récurrence
        let data = await recurrenceService.create_recurrence(req);
        return res.status(data.code).json({ result: data.result });
    } else if (testParamRecurrence.code == 400) { // création d'une résa sans récurrence
        //Verif des conflits
        //TODO avec working days service
        //créer la réservation
        let data1 = await reservationService.create_booking(req);
        return res.status(data1.code).json({ result: data1.result });
    }
};
exports.testParamsBooking = async (req, res) => {
    let testParam = await testParamService.test_params_booking(req);
    console.log('testParam.result (controller) : ' + testParam.result);
    return res.status(testParam.code).json({ result: testParam.result });
}
