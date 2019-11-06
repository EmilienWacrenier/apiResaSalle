// Express router
var express = require('express');
var router = express.Router();


// Controller declaration
const SalleController = require('../controllers/salle.controller.js');

//GET Salles
router.get('/salles', SalleController.getSalles);

router.get('/salle/:id', SalleController.getSalle);

// Export routes
module.exports = router;
