const reservationService = require('../services/reservation.service');
//get all reservations
exports.getReservations = async (req, res) => {
        let data = await reservationService.get_reservations();
        return res.status(200).json(data);
};
//get 1 reservation by id
exports.getReservation = async (req, res) => {
        let data = await reservationService.get_reservation(req.params);
        return res.status(200).json(data);
};
