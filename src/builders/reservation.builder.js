const db = require('../config/db.config');
//Créer une réservation
module.exports.createReservation = function (dateDebut, dateFin, objet, etat, user_id, /*recurrence_id,*/ salle_id) {
  return new Promise(async (resolve,reject) => {
    try {
      const nouvReservation = await db.models.Reservation.create(
        {
          dateDebut: dateDebut,
          dateFin: dateFin,
          objet: objet,
          etat: etat,
          user_id: user_id,
          // recurrence_id: recurrence_id,
          salle_id: salle_id
        }
      );
      resolve(nouvReservation);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
//Trouver toutes les reservations
module.exports.findReservations = function () {
    return new Promise(async (resolve, reject) => {
        const reservations = await db.models.Reservation.findAll();
        resolve(reservations);
    });
  };
//Trouver 1 reservation par id
  module.exports.findReservation = function (id) {
    return new Promise(async (resolve, reject) => {
        const reservation = await db.models.Reservation.findOne(
          {
            where: {
              id: id
            }
          }
        );
        resolve(reservation);
    });
  };
