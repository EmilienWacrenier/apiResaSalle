const db = require('../config/db.config');

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
