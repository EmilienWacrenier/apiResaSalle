const reservationBuilder = require('../builders/reservation.builder');
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
