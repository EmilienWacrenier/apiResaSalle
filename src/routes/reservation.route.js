// Express router
var express = require('express');
var router = express.Router();


// Controller declaration
const ReservationController = require('../controllers/reservation.controller.js');

//GET all reservations
router.get('/reservations', ReservationController.getReservations);
//GET 1 reservation by id
router.get('/reservation/:id', ReservationController.getReservatione);

// Export routes
module.exports = router;
