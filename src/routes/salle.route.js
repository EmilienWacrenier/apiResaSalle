// Express router
var express = require('express');
var router = express.Router();

// Controller declaration
const SalleController = require('../controllers/salle.controller.js');

// GET
router.get('/salles', SalleController.getSalles);
router.get('/salleById', SalleController.getSalle);

router.get('/sallesAvailable', SalleController.getSallesAvailable); //?


// Export routes
module.exports = router;
