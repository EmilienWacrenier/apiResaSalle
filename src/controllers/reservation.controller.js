const reservationService = require('../services/reservation.service');
//créer 1 réservation
exports.creerReservation = async (req,res) => {
    let data = await reservationService.create_reservation(req);
    return res.status(data.code).json(data.result);

};
//get all reservations
exports.getReservations = async (req, res) => {
        let data = await reservationService.get_reservations();
        return res.status(data.code).json(data.result);
}
//get 1 reservation by id
exports.getReservationById = async (req, res) => {
        let data = await reservationService.get_reservation_by_id(req.params);
        return res.status(data.code).json(data.result);
}
