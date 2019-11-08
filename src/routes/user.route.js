// Express router
var express = require('express');
var router = express.Router();

// Controller declaration
const userController = require('../controllers/user.controller.js');

//GET POSTS
router.get('/users', userController.getUsers);
router.get('/user', userController.getUser);
router.post('/inscription', userController.inscription);
router.get('/connexion', userController.connexion);

// Export routes
module.exports = router;    