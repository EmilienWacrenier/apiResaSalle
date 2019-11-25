// Express router
var express = require('express');
var router = express.Router();
var jwt = require('../interceptors/jwt');

// Controller declaration
const userController = require('../controllers/user.controller.js');

//GET
router.get('/users', jwt.verifyToken, jwt.verifyRole(1),userController.getUsers);
router.get('/user', userController.getUser);
router.get('/userById', userController.getUserById);

// POST
router.post('/login', userController.connexion);
router.post('/register', userController.inscription);

// PUT


// DELETE


// Export routes
module.exports = router;
