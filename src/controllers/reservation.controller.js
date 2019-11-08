const reservationService = require('../services/reservation.service');
const db = require('../config/db.config');

//create 1 réservation
exports.reserver = async (req,res) => {
  try {
    var reservation = db.models.Reservation.create({
      dateDebut: req.body.dateDebut,
      dateFin: req.body.dateFin,
      objet: req.body.objet,
      etat: true,
      user_id: 1,
      recurrence_id: null,
      salle_id: 1
    })
      .then(function (reservation) {
        return res.status(200).json(reservation);
      })
  }
  catch (err) {
    return res.json(err);
  }
};
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
