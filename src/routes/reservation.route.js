// Express router
var express = require('express');
var router = express.Router();


// Controller declaration
const ReservationController = require('../controllers/reservation.controller.js');

//Create 1 reservation
router.post('/createReservation', ReservationController.creerReservation);
//GET all reservations
router.get('/reservations', ReservationController.getReservations);
//GET 1 reservation by id
router.get('/reservationById/:id', ReservationController.getReservationById);

// Export routes
module.exports = router;
