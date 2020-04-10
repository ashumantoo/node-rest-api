const express = require('express');
const routes = express.Router();
const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/order');

routes.get('/', checkAuth, orderController.getOrders);
routes.post('/', checkAuth, orderController.createOrder);
routes.get('/:orderId', checkAuth, orderController.getOrder);
routes.delete('/:orderId', checkAuth, orderController.deleteOrder);

module.exports = routes;