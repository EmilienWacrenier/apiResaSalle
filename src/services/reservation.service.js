const reservationBuilder = require('../builders/reservation.builder');
//Créer une réservation
module.exports.create_reservation = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        dateDebut,
        dateFin,
        objet,
        etat,
        user_id,
        // recurrence_id,
        salle_id
      } = body;
      const nouvReservation = await reservationBuilder.createReservation(dateDebut, dateFin, objet, etat, user_id, /*recurrence_id,*/ salle_id);
      resolve(nouvReservation);

    } catch(err) {
      reject({
        status: 500,
        message: err
      });
    };
  })
};
//get all reservations
module.exports.get_reservations = () => {
  return new Promise(async (resolve, reject) => {
    const reservations = await reservationBuilder.findReservations();
    resolve(reservations);
  });
};
//get reservation by id
module.exports.get_reservation = (params) => {
  return new Promise(async (resolve, reject) => {
    const {
      id
    } = params;
    const reservation = await reservationBuilder.findReservation(id);
    resolve(reservation);
  });
};
