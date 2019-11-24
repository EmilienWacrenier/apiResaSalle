const reservationService = require('../services/reservation.service');
const workingDaysService = require('../tools/workingDays.service');

exports.creerReservation = async (req, res) => {
    let data = await reservationService.create_reservation(req);
    return res.status(data.code).json({ result: data.result });

};

exports.getReservations = async (req, res) => {
    let data = await reservationService.get_reservations();
    return res.status(data.code).json({ result: data.result });
}

exports.getReservationById = async (req, res) => {
    let data = await reservationService.get_reservation_by_id(req);
    return res.status(data.code).json({ result: data.result });
}

exports.getSallesBooked = async (req, res) => {
    if (!req.body.endDate) {
        let data = await reservationService.get_salles_booked_by_day(req);
        return res.status(data.code).json({ result: data.result });
    } else {
        let data = await reservationService.get_salles_booked_between(req);
        return res.status(data.code).json({ result: data.result });
    }
}

exports.getSallesBookedById = async (req, res) => {
    let data = await reservationService.get_salles_booked_by_id(req);
    return res.status(data.code).json({ result: data.result });
}

exports.getReservationsByUserId = async (req, res) => {
    let data = await reservationService.get_reservations_by_user_id(req);
    return res.status(data.code).json({ result: data.result });
}
//test isWorkingDay
// exports.isWorkingDay = () => {
//     let data = workingDaysService.liste_jours_feries();
//     return data;
// }
//test isWeekEnd
exports.isWeekEnd = async (req, res) => {
    let data = await workingDaysService.is_week_end(req);
    return res.status(data.code).json({result: data.result });
}
//test isFerie
exports.isFerie = (req) => {
    let data = workingDaysService.is_ferie(req);
    return console.log(data);
    return data.toString();
}
