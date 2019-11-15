// Express router
var express = require('express');
var router = express.Router();


// Controller declaration
const SalleController = require('../controllers/salle.controller.js');

router.get('/salles', SalleController.getSalles);
router.get('/salle/:id', SalleController.getSalle);
router.get('/sallesAvailable', SalleController.getSallesAvailable);


// Export routes
module.exports = router;
