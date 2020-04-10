const express = require('express');
const routes = express.Router();

const userController = require('../controllers/user');

routes.post('/signup', userController.signup);
routes.get('/signin', userController.signin);
routes.delete('/:userId', userController.deleteUser);

module.exports = routes;



