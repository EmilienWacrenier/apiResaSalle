const reservationService = require('../services/reservation.service');

//créer 1 réservation
exports.creerReservation = async (req,res) => {
    let data = await reservationService.create_reservation(req);
    return res.status(200).json(data);

};
//get all reservations
exports.getReservations = async (req, res) => {
        let data = await reservationService.get_reservations();
        return res.status(200).json(data);
}
//get 1 reservation by id
exports.getReservationById = async (req, res) => {
        let data = await reservationService.get_reservation_by_id(req.params);
        return res.status(200).json(data);
}
//get salles booked
exports.getSallesBooked = async (req, res) => {
    if (!req.body.endDate) {
        let data = await reservationService.get_salles_booked_by_day(req);
        return res.status(200).json(data);
    } else {
        let data = await reservationService.get_salles_booked_between(req);
        return res.status(200).json(data);
    }
}
//get réservations  by ID_salle
exports.getSallesBookedById = async (req,res) => {
    let data = await reservationService.get_salles_booked_by_id(req);
    return res.status(200).json(data);
}
