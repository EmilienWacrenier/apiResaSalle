// Express router
var express = require('express');
var router = express.Router();

// Controller declaration
const ReservationController = require('../controllers/reservation.controller.js');

//GET
router.get('/reservations', ReservationController.getReservations);
router.get('/reservationById', ReservationController.getReservationById);
router.get('/reservationsByDate', ReservationController.getSallesBookedBetween);
router.get('/reservationsByDay', ReservationController.getSallesBookedByDay);
router.get('/reservationsByRoomId', ReservationController.getReservationByRoomId);
router.get('/reservationsByUserId', ReservationController.getReservationsByUserId);
router.get('/participants', ReservationController.getParticipantsByIdReservation);
router.get('/checkReservation', ReservationController.checkReservation);
router.get('/checkRecurrence', ReservationController.checkRecurrence);

//POST
router.post('/createReservation', ReservationController.creerReservation);
router.post('/createBooking', ReservationController.createBooking);

// PUT

// DELETE
router.delete('/deleteReservation', ReservationController.deleteReservation);

//TEST isFreeDate
router.get('/isFreeDate', ReservationController.isFreeDate);
// TEST workingDay
router.get('/isWorkingDay', ReservationController.isWorkingDay);
//TEST isWeekEnd
router.get('/isWeekEnd', ReservationController.isWeekEnd);
//TEST isFerie
router.get('/isFerie', ReservationController.isFerie);
//TEST testParamsBooking
router.post('/testParamsBooking', ReservationController.testParamsBooking);
// Export routes
module.exports = router;
