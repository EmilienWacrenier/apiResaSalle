// Express router
var express = require('express');
var router = express.Router();


// Controller declaration
const ReservationController = require('../controllers/reservation.controller.js');

//GET
router.get('/reservations', ReservationController.getReservations);
router.get('/reservationById/:id', ReservationController.getReservationById);
router.get('/reservationsByDate/:startDate/:endDate', ReservationController.getSallesBookedBetween);
router.get('/reservationsByDay/:startDate', ReservationController.getSallesBookedByDay);
router.post('/reservationsBySalleId', ReservationController.getSallesBookedById);
router.get('/reservationsByUserId', ReservationController.getReservationsByUserId);

//POST
router.post('/createReservation', ReservationController.creerReservation);

// PUT


// DELETE


// TEST workingDay
router.get('/isWorkingDay', ReservationController.isWorkingDay);
//TEST isWeekEnd
router.get('/isWeekEnd', ReservationController.isWeekEnd);
//TEST isFerie
router.get('/isFerie', ReservationController.isFerie);
// Export routes
module.exports = router;
