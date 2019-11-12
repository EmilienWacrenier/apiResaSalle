// Express router
var express = require('express');
var router = express.Router();


// Controller declaration
const SalleController = require('../controllers/salle.controller.js');

//GET all Salles
router.get('/salles', SalleController.getSalles);
//GET 1 salle by id
router.get('/salle/:id', SalleController.getSalle);
//Get salles booked entre startDate et endDate
router.get('/sallesReserveesEntre', SalleController.getSallesBookedBetween);

// Export routes
module.exports = router;
