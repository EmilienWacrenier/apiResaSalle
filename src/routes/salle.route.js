// Express router
var express = require('express');
var router = express.Router();


// Controller declaration
const SalleController = require('../controllers/salle.controller.js');

//GET all Salles
router.get('/salles', SalleController.getSalles);
//GET 1 salle by id
router.get('/salle/:id', SalleController.getSalle);
//GET 1 salle by id liée à une réservation entre startDate et endDate
router.get('/sallesBookedBetweenById', SalleController.getSallesBookedBetweenById);
//GET les salles réservées aujourd'hui
// router.get('/sallesBookedToday', SalleController.getSallesBookedToday);
//Get salles booked entre startDate et endDate
router.get('/sallesBookedBetween', SalleController.getSallesBookedBetween);

// Export routes
module.exports = router;
