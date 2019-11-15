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


// Export routes
module.exports = router;
