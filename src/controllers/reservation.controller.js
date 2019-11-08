const reservationService = require('../services/reservation.service');
//créer 1 réservation
exports.creerReservation = async (req,res) => {
  try {
    let data = await reservationService.create_reservation(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(err).send(err.message);
  }
};
//get all reservations
exports.getReservations = async (req, res) => {
        let data = await reservationService.get_reservations();
        return res.status(200).json(data);
}
//get 1 reservation by id
exports.getReservation = async (req, res) => {
        let data = await reservationService.get_reservation(req.params);
        return res.status(200).json(data);
}
