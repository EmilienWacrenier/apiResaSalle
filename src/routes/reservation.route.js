// Express router
var express = require('express');
var router = express.Router();


// Controller declaration
const ReservationController = require('../controllers/reservation.controller.js');

//GET
router.get('/reservations', ReservationController.getReservations);
router.get('/reservationById', ReservationController.getReservationById);
router.get('/reservationsByDate', ReservationController.getSallesBooked);
router.get('/reservationsBySalleId', ReservationController.getSallesBookedById);

//POST
router.post('/createReservation', ReservationController.creerReservation);
router.post('/reservationsByUserId', ReservationController.getReservationsByUserId);

// PUT


// DELETE


// Export routes
module.exports = router;
